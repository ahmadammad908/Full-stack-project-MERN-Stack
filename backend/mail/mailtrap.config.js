




// import {MailtrapClient} from 'mailtrap'
// import dotenv from "dotenv"

// dotenv.config()
// const TOKEN = process.env.MAILTRAP_TOKEN;

// export const mailtrapClient = new MailtrapClient({
//   token: TOKEN,
//   testInboxId: 3389765,
// });

// export const sender = {
//   email: "hello@example.com",
//   name: "Ahmad Ammad",
// };

import { MailtrapClient } from 'mailtrap'
const TOKEN = "5cd229fd60364c7fe6faf446b2a7c442";

export const mailtrapClient = new MailtrapClient({
  token: TOKEN,
});

export const sender = {
  email: "hello@demomailtrap.com",
  name: "Mailtrap Test",
};
