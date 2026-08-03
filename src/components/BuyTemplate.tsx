import { buyTemplateUrl } from '../data/content'

/**
 * Global "Buy template" block — fixed bottom-right, persistent on every page,
 * visible on all breakpoints (measured live on the original: right 20 / bottom 60,
 * 142x145, bg #1c1c1c, radius 10, no entrance animation).
 */
export default function BuyTemplate() {
  return (
    <a
      href={buyTemplateUrl}
      target="_blank"
      rel="noreferrer"
      aria-label="Buy the AIthor template"
      className="fixed bottom-[60px] right-[20px] z-40 flex h-[145px] w-[142px] flex-col items-center justify-center gap-3 rounded-[10px] bg-[#1c1c1c] transition-colors duration-300 hover:bg-[#0a0a0a]"
    >
      <span className="text-[10px] uppercase tracking-wider text-[#999]">Template</span>
      <span className="rounded-[6px] bg-[#f2f2f2] px-4 py-2 text-sm font-medium text-[#0a0a0a]">
        Buy template
      </span>
    </a>
  )
}
