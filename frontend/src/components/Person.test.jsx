import { render } from "@testing-library/react";

import Person from "./Person.jsx";

const person = {
  name: "Jane Doe",
  number: "09-9128374",
};

test("renders content", () => {
  const { container } = render(<Person person={person} />);

  const div = container.querySelector(".person");
  expect(div).toHaveTextContent("Jane Doe 09-9128374");
});
