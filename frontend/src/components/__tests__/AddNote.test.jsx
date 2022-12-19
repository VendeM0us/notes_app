import { test, expect, vi } from 'vitest';
import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AddNote from '../AddNote';

test('<AddNote /> update parents state and calls on submit', async () => {
  const createNote = vi.fn();
  const user = userEvent.setup();

  render(<AddNote createNote={createNote} />);

  const input = screen.getByPlaceholderText('your new note here...');
  const sendButton = screen.getByText('save');

  await user.type(input, 'testing a form');
  await user.click(sendButton);

  expect(createNote.mock.calls).toHaveLength(1);
  expect(createNote.mock.calls[0][0].content).toBe('testing a form');
});
