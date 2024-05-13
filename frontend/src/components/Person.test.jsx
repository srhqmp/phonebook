import { render, screen } from '@testing-library/react'
import Person from './Person.jsx'

test('renders content', () => {
  const person = {
    name: 'Jane Doe',
    number: '09-9128374',
  }

  render(<Person person={person} />)

  const element = screen.getByText('Jane Doe 09-9128374')
  expect(element).toBeDefined()
})
