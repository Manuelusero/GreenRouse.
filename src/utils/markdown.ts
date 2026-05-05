/**
 * Mínimo renderer de Markdown para contenido de artículos del blog.
 * Soporta: ## headings, **bold**, *italic*, - listas.
 * Solo usar con contenido de confianza (DB propia, no input de usuarios).
 */

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function applyInlineFormatting(str: string): string {
  return str
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/_(.+?)_/g, '<em>$1</em>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
}

function processInline(line: string): string {
  return applyInlineFormatting(escapeHtml(line))
}

export function markdownToHtml(markdown: string): string {
  // Dividir por bloques separados por líneas vacías
  const blocks = markdown.split(/\n\n+/)
  const html: string[] = []

  for (const block of blocks) {
    const trimmed = block.trim()
    if (!trimmed) continue

    const lines = trimmed.split('\n').map(l => l.trim())

    if (lines.length === 1 && trimmed.startsWith('### ')) {
      html.push(
        `<h3 class="text-xl font-semibold text-soil-dark mt-6 mb-2">${processInline(trimmed.slice(4))}</h3>`
      )
    } else if (lines.length === 1 && trimmed.startsWith('## ')) {
      html.push(
        `<h2 class="text-2xl font-bold text-soil-dark mt-8 mb-3">${processInline(trimmed.slice(3))}</h2>`
      )
    } else if (lines.length === 1 && trimmed.startsWith('# ')) {
      // h1 en contenido se rencuerda como h2 para no interferir con el h1 de la página
      html.push(
        `<h2 class="text-2xl font-bold text-soil-dark mt-8 mb-3">${processInline(trimmed.slice(2))}</h2>`
      )
    } else if (lines.every(l => l.startsWith('- '))) {
      const items = lines
        .map(l => `<li>${processInline(l.slice(2))}</li>`)
        .join('\n')
      html.push(
        `<ul class="list-disc ml-6 mb-4 space-y-1 text-gray-700">\n${items}\n</ul>`
      )
    } else if (lines.every(l => /^\d+\.\s/.test(l))) {
      const items = lines
        .map(l => `<li>${processInline(l.replace(/^\d+\.\s/, ''))}</li>`)
        .join('\n')
      html.push(
        `<ol class="list-decimal ml-6 mb-4 space-y-1 text-gray-700">\n${items}\n</ol>`
      )
    } else {
      const text = lines.map(l => processInline(l)).join(' ')
      html.push(`<p class="text-gray-700 leading-relaxed mb-4">${text}</p>`)
    }
  }

  return html.join('\n')
}
