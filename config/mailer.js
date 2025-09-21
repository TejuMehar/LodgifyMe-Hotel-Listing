const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail", // or use smtp settings for production
  auth: {
    user: process.env.MAIL_USER, // your email address
    pass: process.env.MAIL_PASS  // your app password (not Gmail password)
  }
});

const sendWelcomeEmail = async (to, username) => {
  await transporter.sendMail({
    from: `"LodgifyMe" <${process.env.MAIL_USER}>`,
    to,
    subject: "Welcome to LodgifyMe!",
    html: `
  <div style="max-width: 600px; margin: auto; font-family: 'Segoe UI', sans-serif; border: 1px solid #e0e0e0; border-radius: 10px; padding: 30px; background: #fff;">
    <div style="text-align: center; margin-bottom: 20px;">
      <h1 style="color: #ff6f00;">Welcome to LodgifyMe 🏡</h1>
      <p style="color: #555; font-size: 16px;">Hi <strong>${username}</strong>, we’re excited to have you join us!</p>
    </div>

    <div style="font-size: 15px; color: #333; line-height: 1.6;">
      <p>Thanks for signing up with <strong>LodgifyMe</strong> — your go-to platform for booking and managing beautiful stays and accommodations.</p>
      
      <p>Here’s what you can do now:</p>
      <ul style="padding-left: 20px;">
        <li>🏠 Explore listings from around the country</li>
        <li>🔐 Log in and manage your bookings easily</li>
        <li>📢 Share your own place and become a host!</li>
      </ul>

      <p>Start your journey now and enjoy your stay with us. 😊</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="https://lodgifyme.com/login" style="background: linear-gradient(90deg, #ff8a00, #e52e71); padding: 12px 24px; border-radius: 30px; color: white; text-decoration: none; font-weight: bold;">Login to Your Account</a>
      </div>
    </div>

    <hr style="border: none; border-top: 1px solid #ddd; margin: 40px 0;">
    
    <footer style="font-size: 12px; color: #777; text-align: center;">
      <p>This is an automated message. Please do not reply.</p>
      <p>&copy; ${new Date().getFullYear()} LodgifyMe, All rights reserved.</p>
    </footer>
  </div>
`

  });
};

const sendListingConfirmationEmail = async (to, username, listingTitle) => {
  await transporter.sendMail({
    from: `"LodgifyMe" <${process.env.MAIL_USER}>`,
    to,
    subject: "🏡 Your Listing is Live on LodgifyMe!",
   html: `
  <div style="max-width: 600px; margin: auto; padding: 30px; font-family: 'Segoe UI', Roboto, sans-serif; background: #ffffff; border-radius: 16px; box-shadow: 0 0 20px rgba(0,0,0,0.08); border: 1px solid #eaeaea;">
    
    <div style="text-align: center; margin-bottom: 30px;">
      <img src="https://cdn-icons-png.flaticon.com/512/2356/2356878.png" alt="Listing Icon" style="width: 60px; height: 60px;" />
      <h1 style="font-size: 24px; color: #28a745; margin: 15px 0 5px;">Listing is Now Live! 🎉</h1>
      <p style="font-size: 16px; color: #555;">Hey <strong>${username}</strong>, your listing <strong>"${listingTitle}"</strong> has just gone live on <strong>LodgifyMe</strong>.</p>
    </div>

    <div style="font-size: 15px; color: #333; line-height: 1.6; padding: 0 10px;">
      <ul style="list-style: none; padding: 0; margin: 0;">
        <li>✅ Visible to travelers</li>
        <li>📅 Bookings now open</li>
        <li>💼 Manage your listing anytime</li>
      </ul>

      <div style="text-align: center; margin: 30px 0;">
        <a href="https://lodgifyme.com/listings" style="background: linear-gradient(90deg, #ff8a00, #e52e71); padding: 14px 28px; border-radius: 30px; color: white; text-decoration: none; font-weight: bold; font-size: 16px; box-shadow: 0 4px 15px rgba(229,46,113,0.3); display: inline-block;">
          🚀 View My Listing
        </a>
      </div>

      <p style="font-size: 14px; color: #777;">Start attracting guests and make your hosting journey memorable!</p>
    </div>

    <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;" />

    <footer style="text-align: center; font-size: 12px; color: #aaa;">
      <p>This is an automated message. Please do not reply.</p>
      <p>&copy; ${new Date().getFullYear()} LodgifyMe, All rights reserved.</p>
    </footer>
  </div>
`

  });
};

const sendReviewEmail = async (to, username, listingTitle, reviewContent) => {
  await transporter.sendMail({
    from: `"LodgifyMe Reviews" <${process.env.MAIL_USER}>`,
    to,
    subject: `Thanks for reviewing "${listingTitle}"!`,
    html: `
      <div style="max-width:600px;margin:auto;padding:30px;font-family:'Segoe UI',sans-serif;background:#fff;border-radius:12px;box-shadow:0 0 10px rgba(0,0,0,0.1);">
        <h2 style="color:#ff6f00;">Hi ${username},</h2>
        <p>Thanks for sharing your thoughts on <strong>${listingTitle}</strong> 📝</p>
        <blockquote style="border-left: 4px solid #ff6f00; margin: 20px 0; padding-left: 15px; color: #555;">
          "${reviewContent}"
        </blockquote>
        <p>Your feedback helps others and supports great hosts.</p>
        <div style="text-align:center;margin:30px 0;">
          <a href="https://lodgifyme.com/listings" style="background:linear-gradient(90deg,#ff8a00,#e52e71);color:white;padding:12px 24px;border-radius:30px;text-decoration:none;font-weight:bold;">Explore More Stays</a>
        </div>
        <hr style="margin-top:40px;">
        <footer style="font-size:12px;color:#aaa;text-align:center;">
          This is an automated email. Please do not reply.<br/>
          &copy; ${new Date().getFullYear()} LodgifyMe
        </footer>
      </div>
    `,
  });
};

module.exports = { sendWelcomeEmail, sendListingConfirmationEmail,sendReviewEmail };

