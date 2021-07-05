import { Navbar } from "./Navbar";
import { BrowserRouter as Router } from "react-router-dom";
import { cleanup, render, screen, waitFor } from '@testing-library/react';

afterEach(() =>{
    cleanup();
});
test('App renders', () => {
    render(<Router><Navbar /></Router>);
});
test('Link displays the text Home', () =>{
    render(<Router><Navbar /></Router>);
    let home = screen.getByText('Home');
    expect(home).toBeInTheDocument();
});