import { createClient } from "@supabase/supabase-js";

// export const createClientAdmin = () => {
//   return createClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!,
//     {
//       auth: {
//         autoRefreshToken: false,
//         persistSession: false,
//       },
//     }
//   );
// };

export const createClientAdmin = () => { 
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!, 
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!, {
      auth: {
        storage: {
          getItem: () => {
            return Promise.resolve('FETCHED_COOKIE')
          },
          setItem: () => {},
          removeItem: () => {},
        },
      },
    },
  );
  };