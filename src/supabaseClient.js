import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.REACT_APP_APP_URL;
const supabaseKey = process.env.REACT_APP_APP_KEY;
console.log("Supabase URL:", process.env.REACT_APP_APP_URL);
console.log("Supabase Key:", process.env.REACT_APP_APP_KEY);


export const supabase = createClient(supabaseUrl, supabaseKey);
