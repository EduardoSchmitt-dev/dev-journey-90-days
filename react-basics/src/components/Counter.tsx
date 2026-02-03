import { useState } from 'react'

export function Counter() {
  const [count, setCount] = useState(0)

  function increment() {
    setCount(count + 1)
  }

  function decrement() {
    setCount(count - 1)
  }

  return (
    <div style={{ marginTop: 20 }}>
      <p>Count: {count}</p>

      <button onClick={increment}>+</button>
      <button onClick={decrement} style={{ marginLeft: 8 }}>
        -
      </button>
    </div>
  )
}
