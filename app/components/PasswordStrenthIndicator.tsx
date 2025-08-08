export default function PasswordStrengthIndicator(props: {
  password: string;
  passwordStrength: string;
}) {
  const { password, passwordStrength } = props;
  return (
    <div>
      {password && (
        <div className="mt-2">
          <div className="flex items-center gap-2">
            <div className="text-sm text-gray-600">Độ mạnh mật khẩu:</div>
            <div className="flex gap-1">
              <div
                className={`h-1 w-8 rounded ${
                  passwordStrength === "weak"
                    ? "bg-red-500"
                    : passwordStrength === "medium"
                    ? "bg-yellow-500"
                    : "bg-green-500"
                }`}
              ></div>
              <div
                className={`h-1 w-8 rounded ${
                  passwordStrength === "medium"
                    ? "bg-yellow-500"
                    : passwordStrength === "strong"
                    ? "bg-green-500"
                    : "bg-gray-200"
                }`}
              ></div>
              <div
                className={`h-1 w-8 rounded ${
                  passwordStrength === "strong" ? "bg-green-500" : "bg-gray-200"
                }`}
              ></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
