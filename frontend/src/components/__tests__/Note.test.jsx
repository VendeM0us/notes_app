import { test, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import Note from '../Note';

const note = {
  content: 'Component testing is done with react-testing-library',
  important: true
};

test('renders content', () => {
  const mockHandler = vi.fn();

  render(<Note note={note} toggleImportance={mockHandler} />);
  const element = screen.getByText('Component testing is done with react-testing-library');

  screen.debug(element);
  expect(element).toBeDefined();
});

test('clicking the button calls event handler once', async () => {
  const mockHandler = vi.fn();

  render(<Note note={note} toggleImportance={mockHandler} />);

  const user = userEvent.setup();
  const button = screen.getByText('make not important');
  await user.click(button);

  expect(mockHandler.mock.calls).toHaveLength(1);
});
