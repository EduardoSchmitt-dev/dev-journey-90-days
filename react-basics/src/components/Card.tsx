type CardProps = { 
  description: string
}

export function Card({ description }: CardProps) {
  return (
    <div style={{ border: '1px solid #ccc', padding: 12, marginBottom: 8}}>
      {description}
    </div>
  )
}