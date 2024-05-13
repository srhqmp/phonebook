import { render } from '@testing-library/react'
import Person from './Person.jsx'

test('renders content', () => {
  const person = {
    name: 'Jane Doe',
    number: '09-9128374',
  }

  const {container} = render(<Person person={person} />)

  const div = container.querySelector(".person")
  expect(div).toHaveTextContent('Jane Doe 09-9128374')
})
