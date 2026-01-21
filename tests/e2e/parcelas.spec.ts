import { test, expect } from '@playwright/test'

test.describe('GreenRouse E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Limpiar cookies y localStorage antes de cada test
    await page.context().clearCookies()
    await page.evaluate(() => localStorage.clear())
  })

  test('debe cargar la página principal', async ({ page }) => {
    await page.goto('/')
    
    // Verificar que la página carga correctamente
    await expect(page).toHaveTitle(/GreenRouse/)
    await expect(page.locator('h1')).toBeVisible()
  })

  test('debe navegar a la página de parcelas', async ({ page }) => {
    await page.goto('/')
    
    // Hacer clic en el enlace de parcelas
    await page.click('a[href="/parcelas"]')
    
    // Verificar que estamos en la página de parcelas
    await expect(page).toHaveURL(/.*parcelas/)
    await expect(page.locator('h1')).toContainText('Mis Parcelas')
  })

  test('debe mostrar formulario de login', async ({ page }) => {
    await page.goto('/auth/login')
    
    // Verificar elementos del formulario
    await expect(page.locator('input[type="email"]')).toBeVisible()
    await expect(page.locator('input[type="password"]')).toBeVisible()
    await expect(page.locator('button[type="submit"]')).toBeVisible()
  })

  test('debe crear una nueva parcela', async ({ page }) => {
    // Mock de autenticación
    await page.goto('/parcelas')
    
    // Esperar a que cargue la página
    await page.waitForLoadState('networkidle')
    
    // Hacer clic en el botón de crear parcela
    await page.click('[data-testid="crear-parcela-btn"]')
    
    // Verificar que se abre el modal
    await expect(page.locator('[data-testid="modal-parcela"]')).toBeVisible()
    
    // Llenar el formulario
    await page.fill('[data-testid="input-nombre"]', 'Parcela de Test E2E')
    await page.fill('[data-testid="input-area"]', '25')
    await page.selectOption('[data-testid="select-tipo"]', 'huerto')
    
    // Enviar el formulario
    await page.click('[data-testid="btn-guardar-parcela"]')
    
    // Verificar que se creó la parcela
    await expect(page.locator('text=Parcela de Test E2E')).toBeVisible()
  })

  test('debe filtrar parcelas', async ({ page }) => {
    await page.goto('/parcelas')
    await page.waitForLoadState('networkidle')
    
    // Seleccionar filtro por estado
    await page.selectOption('[data-testid="filtro-estado"]', 'activa')
    
    // Esperar a que se aplique el filtro
    await page.waitForTimeout(1000)
    
    // Verificar que se aplicó el filtro
    const url = page.url()
    expect(url).toContain('estado=activa')
  })

  test('debe paginar resultados', async ({ page }) => {
    await page.goto('/parcelas')
    await page.waitForLoadState('networkidle')
    
    // Hacer clic en siguiente página
    await page.click('[data-testid="btn-siguiente"]')
    
    // Verificar que cambió la página en la URL
    const url = page.url()
    expect(url).toContain('page=2')
  })

  test('debe mostrar detalles de parcela', async ({ page }) => {
    await page.goto('/parcelas')
    await page.waitForLoadState('networkidle')
    
    // Hacer clic en la primera parcela
    await page.click('[data-testid="parcela-card"]:first-child')
    
    // Verificar que navega a la página de detalles
    await expect(page).toHaveURL(/.*parcelas\/.*/)
    await expect(page.locator('[data-testid="parcela-detalles"]')).toBeVisible()
  })

  test('debe buscar parcelas', async ({ page }) => {
    await page.goto('/parcelas')
    await page.waitForLoadState('networkidle')
    
    // Escribir en el campo de búsqueda
    await page.fill('[data-testid="input-busqueda"]', 'tomate')
    
    // Esperar a que se realice la búsqueda
    await page.waitForTimeout(1000)
    
    // Verificar que se aplicó la búsqueda
    const url = page.url()
    expect(url).toContain('busqueda=tomate')
  })

  test('debe ser responsive en móvil', async ({ page }) => {
    // Simular viewport móvil
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/parcelas')
    
    // Verificar que los elementos se adaptan
    await expect(page.locator('[data-testid="mobile-menu"]')).toBeVisible()
    await expect(page.locator('[data-testid="parcelas-grid"]')).toBeVisible()
  })

  test('debe manejar errores de red', async ({ page }) => {
    // Simular offline
    await page.context().setOffline(true)
    
    await page.goto('/parcelas')
    
    // Verificar que muestra mensaje de error
    await expect(page.locator('[data-testid="error-message"]')).toBeVisible()
    await expect(page.locator('text=Error de conexión')).toBeVisible()
  })

  test('debe cargar imágenes optimizadas', async ({ page }) => {
    await page.goto('/parcelas')
    
    // Esperar a que carguen las imágenes
    const images = page.locator('img[data-testid="optimized-image"]')
    await expect(images.first()).toBeVisible()
    
    // Verificar que las imágenes tienen src correcto
    const firstImage = images.first()
    const src = await firstImage.getAttribute('src')
    expect(src).toContain('/_next/image')
  })

  test('debe mostrar skeleton loading', async ({ page }) => {
    await page.goto('/parcelas')
    
    // Verificar que muestra skeletons mientras carga
    await expect(page.locator('[data-testid="skeleton-loader"]')).toBeVisible()
    
    // Esperar a que cargue el contenido
    await page.waitForSelector('[data-testid="parcela-card"]', { state: 'visible' })
    
    // Verificar que los skeletons desaparecen
    await expect(page.locator('[data-testid="skeleton-loader"]')).not.toBeVisible()
  })

  test('debe mantener estado en navegación', async ({ page }) => {
    await page.goto('/parcelas')
    
    // Aplicar filtros
    await page.selectOption('[data-testid="filtro-estado"]', 'activa')
    await page.fill('[data-testid="input-busqueda"]', 'test')
    
    // Navegar a otra página y volver
    await page.goto('/calculadora')
    await page.goBack()
    
    // Verificar que se mantienen los filtros
    await expect(page.locator('[data-testid="filtro-estado"]')).toHaveValue('activa')
    await expect(page.locator('[data-testid="input-busqueda"]')).toHaveValue('test')
  })
})
