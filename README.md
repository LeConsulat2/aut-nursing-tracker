src/
├── components/
│   ├── AddCustomCourseForm.tsx   // The form to add/edit custom courses
│   ├── CourseItem.tsx            // Renders a single course row (predefined or custom)
│   ├── ProgressSummary.tsx       // Displays total points and graduation status
│   └── ... (any other small, reusable UI components)
├── constants/
│   ├── autCourses.ts             // AUT_NURSING_COURSE_REQUIREMENTS, TOTAL_GRADUATION_POINTS
│   └── grades.ts                 // PASSING_GRADES, FAILING_GRADES
├── hooks/
│   └── useCourseProgress.ts      // Your custom hook with all the state and logic
├── pages/
│   └── Home.tsx                  // This is your main "Progress Tracker" page
├── types/
│   └── courseTypes.ts            // All your TypeScript interfaces and types
└── App.tsx                       // Or your main application entry point that renders pages/Home

**Here's a detailed breakdown of the transformations required for each new/modified file:**

1.  **`types/courseTypes.ts`**:
    * **Extract:** Move all TypeScript interfaces and type aliases from the original component (e.g., `CourseStatus`, `Course`, `CourseStatusType`, `CustomCourse`) into this dedicated types file. Ensure type definitions are accurate and self-contained.

2.  **`constants/grades.ts`**:
    * **Extract:** Move the `PASSING_GRADES` and `FAILING_GRADES` arrays into this file.

3.  **`constants/autCourses.ts`**:
    * **Consolidate:** Ensure this file exclusively contains `AUT_NURSING_COURSE_REQUIREMENTS` and `TOTAL_GRADUATION_POINTS`.
    * **Import:** Correctly import any necessary types (e.g., `Course`) from `../types/courseTypes`.

4.  **`hooks/useCourseProgress.ts`**:
    * **Create & Encapsulate:** Develop a new custom React hook. This hook must encapsulate *all* state declarations (`useState`, `useEffect`) and *all* business logic functions (e.g., `updateCourseStatus`, `handleAddCustomCourse` which should be renamed to `addOrUpdateCustomCourse` to reflect its dual purpose, `handleRemoveCustomCourse` renamed to `removeCustomCourse`, `resetSheet` renamed to `resetAllProgress`, `pasteData`, and the logic for calculating `currentTotalPoints` and `graduationStatus`).
    * **Return Value:** The hook should return an object containing all relevant state variables and functions that the main UI components will need to consume.
    * **Dependencies:** Rigorously ensure all `useCallback` and `useEffect` dependencies are correctly identified and included to prevent stale closures or unnecessary re-renders.
    * **Imports:** Import constants and types as required.

5.  **`components/ProgressSummary.tsx`**:
    * **Create:** This component should be a **purely presentational** React component.
    * **Props:** It should accept `currentTotalPoints` and `graduationStatus` as props.
    * **Rendering:** It will render the "Your Progress Summary" section of the UI.

6.  **`components/AddCustomCourseForm.tsx`**:
    * **Create:** This component will manage the form inputs for adding new custom courses and display the list of currently added custom courses.
    * **Internal State:** It should manage its own input field states (`manualCourseCode`, `manualCourseName`, `manualCoursePoints`).
    * **Props:** It will receive `onAddOrUpdateCourse` (a function from the hook), `customCourses` (the list of custom courses), and `onRemoveCustomCourse` as props.
    * **Functionality:** It should include the logic for `handleSubmit` for the form and the button to remove individual custom courses.

7.  **`components/CourseItem.tsx`**:
    * **Create:** Design this as a reusable React component for rendering an individual course entry.
    * **Props:** It will accept `course` (which can be either a predefined `Course` or a `CustomCourse` from `courseTypes.ts`), its `status`, `attempts`, `onUpdateStatus` (from the hook), and an `isCustom` boolean flag to differentiate rendering.
    * **Encapsulation:** The helper functions `getCourseStatusIcon` and `getCourseRowColor` should be moved into or defined within this component, operating solely on its props.

8.  **`pages/Home.tsx`**:
    * **Rename & Refactor:** The original `ProgressTracker` component should be renamed to `Home.tsx` and reside in the `pages/` directory.
    * **Orchestration:** This `Home` component will now be the main orchestrator. It should:
        * Import and utilize the `useCourseProgress` custom hook.
        * Render the `ProgressSummary`, `AddCustomCourseForm`, and iterate over the `AUT_NURSING_COURSE_REQUIREMENTS` and `customCourses` lists to render `CourseItem` components.
        * Pass down the appropriate state variables and functions (from `useCourseProgress`) as props to its child components.
        * Contain the top-level title, reset button, and the paste textarea (`handlePaste` logic should remain here as it interacts with the DOM directly and then calls the hook's `pasteData`).

**Constraints & Quality Assurance:**

* **TypeScript:** Maintain strong TypeScript typing throughout all files.
* **Clean Code:** Ensure component props are clearly defined, functions are pure where possible, and unnecessary re-renders are avoided.
* **Tailwind CSS:** Preserve the existing Tailwind CSS classes for styling.
* **Functional Components:** All new components should be functional React components.
* **Imports:** Ensure all imports are correct and relative paths are adjusted according to the new file structure.

Provide the complete code for each new or modified file, clearly indicating the file path and content. Do not include any conversational filler in the output, only the code."