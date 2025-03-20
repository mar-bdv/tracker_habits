// import { createSlice } from "@reduxjs/toolkit";

// const loadHabitsFromStorage = () => {
//     const storedHabits = localStorage.getItem("habits");
//     return storedHabits ? JSON.parse(storedHabits) : [];
// };

// const saveHabitsToStorage = (habits) => {
//     localStorage.setItem("habits", JSON.stringify(habits));
// };

// const habitsSlice = createSlice({
//     name: "habits",
//     initialState: loadHabitsFromStorage(),
//     reducers: {
//         addHabit: (state, action) => {
//             const newHabit = {
//                 id: Date.now(),
//                 name: action.payload,
//                 notes: "",
//                 category: "",
//                 deadline: "",
//                 completed: false,
//             };
//             state.push(newHabit);
//             saveHabitsToStorage(state);
//         },
//         toggleHabit: (state, action) => {
//             const habit = state.find(h => h.id === action.payload);
//             if (habit) {
//                 habit.completed = !habit.completed;
//                 saveHabitsToStorage(state);
//             }
//         },
//     },
// });

// export const { addHabit, toggleHabit } = habitsSlice.actions;
// export default habitsSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";

const loadHabitsFromStorage = () => {
    const storedHabits = localStorage.getItem("habits");
    return storedHabits ? JSON.parse(storedHabits) : [];
};

const saveHabitsToStorage = (habits) => {
    localStorage.setItem("habits", JSON.stringify(habits));
};

const habitsSlice = createSlice({
    name: "habits",
    initialState: loadHabitsFromStorage(),
    reducers: {
        addHabit: (state, action) => {
            const newHabit = {
                id: Date.now(),
                name: action.payload,
                notes: "",
                category: "",
                deadline: "",
                completed: false,
            };
            state.push(newHabit);
            saveHabitsToStorage(state);
        },
        toggleHabit: (state, action) => {
            const habit = state.find(h => h.id === action.payload);
            if (habit) {
                habit.completed = !habit.completed;
                saveHabitsToStorage(state);
            }
        },
        updateHabit: (state, action) => {
            const { id, updatedData } = action.payload;
            const habit = state.find(h => h.id === id);
            if (habit) {
                Object.assign(habit, updatedData);
                saveHabitsToStorage(state);
            }
        },
    },
});

export const { addHabit, toggleHabit, updateHabit } = habitsSlice.actions;
export default habitsSlice.reducer;