# Task Manager App

This is a Task Manager application built with Next.js for an assignment requiring a feature-rich task management system. The app fulfills all specified requirements, including basic features, React challenges, and CSS challenges.

## Features

### Basic Features
- Add tasks with a form
- Mark tasks as completed
- Delete tasks
- Filter tasks by All, Completed, or Pending
- Persist tasks using local storage

### React Challenges
- Custom `useLocalStorage` hook for managing local storage
- React Context API (`TaskContext`) to manage task data without prop drilling
- Performance optimization with `React.memo`, `useCallback`, and `useMemo`
- Form validation to prevent empty task submissions

### CSS Challenges
- Dark and light mode toggle with theme persistence
- CSS transitions for smooth task addition/removal
- Mobile-first responsive design
- Drag-and-drop task reordering using `react-beautiful-dnd`

## Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/Shivam241/task-manager.git
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open http://localhost:3000 in your browser.

## Notes
- Built with Next.js 15 and React 19
- Uses TypeScript for type safety
- Styles managed with CSS modules and global theming in `globals.css`
- Drag-and-drop functionality is disabled in filtered views to maintain task order consistency

## Submission
The code is committed to the `dev` and pulled into `main` of the GitHub repository: https://github.com/Shivam241/task-manager