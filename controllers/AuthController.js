const { getSupabaseClient, getSupabaseAdmin } = require("../config/supabase");
const { User } = require("../models");

const sendOtp = async (req, res) => {
  try {
    const { phone } = req.body;

    const supabaseAdmin = getSupabaseAdmin();

    const { data: linkData, error: linkErr } =
      await supabaseAdmin.auth.admin.generateLink({
        type: "magiclink",
        email: `${phone}@kleenecars.app`,
      });

    console.log(linkData);

    return res.status(200).json({
      success: !linkErr,
      otp: linkData.properties.email_otp,
      error: linkErr,
    });
  } catch (err) {
    console.log("Error: ", err.message);
    return res.status(500).json({ error: err.message });
  }
};

const getProfile = async (req, res) => {
  try {
    const supabase = getSupabaseClient(req.headers.authorization);
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user || user?.user_metadata?.role !== "admin") {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Fetch profile from our database using Sequelize
    const profile = await User.findOne({
      where: { id: user.id },
      attributes: ["role", "full_name", "phone", "gender", "avatar_url", "id"],
    });

    if (!profile) {
      // Logic from existing app: return generic role if strict profile not found, or maybe just 404
      // Existing app returned { role: 'customer' }
      return res.status(200).json({ role: "customer" });
    }

    res.status(200).json(profile);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getProfile,
  sendOtp,
};
