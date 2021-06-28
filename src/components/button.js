const Button = ({ color = '#fff', children }) => {
  return (
    <button style={{
      backgroundColor: color,
      padding: '1rem',
      border: '2px solid var(--color-text)',
      cursor: 'pointer',
      textTransform: 'uppercase',
    }}
    >
      { children }
    </button>
  )
}

export default Button
