/**
 * Load state from localStorage.
 *
 * @returns {Object|undefined} The deserialized state or undefined if not found or an error occurs.
 */
export const loadState = () => {
    try {
        // Retrieve the serialized state from localStorage
        const serializedState = localStorage.getItem("reduxState");

        // If no state is found, return undefined
        if (serializedState === null) {
            return undefined;
        }

        // Parse and return the deserialized state
        return JSON.parse(serializedState);
    } catch (error) {
        // Handle any errors and return undefined if there's an issue
        return undefined;
    }
};

/**
 * Save state to localStorage while excluding specific slices.
 *
 * @param {Object} state - The Redux state to be saved.
 * @param {Array} [slicesToExclude=[]] - An array of slice names to exclude from storage.
 */
export const saveState = (state, slicesToExclude = []) => {
    try {
        // Filter out specified slices to exclude, ensuring they exist in the state
        const stateToSave = Object.keys(state)
            .filter((key) => !slicesToExclude.includes(key))
            .reduce((acc, key) => {
                acc[key] = state[key];
                return acc;
            }, {});

        // Serialize the state to a JSON string
        const serializedState = JSON.stringify(stateToSave);

        // Store the serialized state in localStorage
        localStorage.setItem("reduxState", serializedState);
    } catch (error) {
        // Handle any errors and log them to the console
        console.error("Error while saving state to localStorage:", error);
    }
};
