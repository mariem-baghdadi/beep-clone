// app/test-pda/page.tsx
export default function TestPDA() {
  return (
    <div style={{ padding: '10px' }}>
      <h1 style={{ fontSize: '24px', color: 'blue' }}>Test PDA</h1>
      <p style={{ fontSize: '16px' }}>Si tu vois ce texte en bleu, le CSS de base fonctionne.</p>
      
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <div style={{ background: '#3b82f6', color: 'white', padding: '10px' }}>
          Bouton bleu
        </div>
        <div style={{ background: '#ef4444', color: 'white', padding: '10px' }}>
          Bouton rouge
        </div>
      </div>
      
      <p className="text-green-600">Si ce texte est vert, Tailwind fonctionne.</p>
    </div>
  )
}