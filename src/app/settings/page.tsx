export default function Settings() {
  return (
    <div className="min-h-screen pt-20 bg-[#F8F5FF] px-6 py-12">
      <div className="max-w-2xl mx-auto bg-white border border-[#E3DDEF] rounded-2xl shadow-lg shadow-[#E3DDEF]/30 p-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-[#4E4C67] mb-2">Settings</h1>
          <p className="text-sm text-[#7F7D93]">
            Manage your preferences, account details, and personal experience.
          </p>
        </div>

        <div className="space-y-6">
          {/* Placeholder Setting Section */}
          <div className="p-4 border border-[#E8E3F4] rounded-xl bg-[#F8F5FF]">
            <h2 className="font-semibold text-[#4E4C67] mb-1 text-sm">
              Account Info
            </h2>
            <p className="text-xs text-[#7F7D93]">
              Update your email, password, or username.
            </p>
          </div>

          <div className="p-4 border border-[#E8E3F4] rounded-xl bg-[#F8F5FF]">
            <h2 className="font-semibold text-[#4E4C67] mb-1 text-sm">
              Preferences
            </h2>
            <p className="text-xs text-[#7F7D93]">
              Choose theme, notification options, and typing preferences.
            </p>
          </div>

          <div className="p-4 border border-[#F0ECFA] rounded-xl bg-[#F3F0FA]/70">
            <h2 className="font-semibold text-[#4E4C67] mb-1 text-sm">
              Danger Zone
            </h2>
            <p className="text-xs text-[#7F7D93] mb-2">
              Delete your account or reset all progress.
            </p>
            <button className="text-sm px-4 py-2 rounded-md bg-[#E3DDEF] hover:bg-[#DAD3ED] text-[#4E4C67] font-medium transition">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
