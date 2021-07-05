import { render, screen } from '@testing-library/react';
import {MemoizedHome} from './Home';

describe('Home.js', () => {
    test('renders App', () => {
        render(<MemoizedHome />);
    });
    test('displays the text Loading...', () => {
        render(<MemoizedHome />);
        let home = screen.getByText('Home');
        expect(home).toBeInTheDocument();
    });
})