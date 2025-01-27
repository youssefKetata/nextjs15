"use client";

import { useRef, useState } from "react";
import { z } from "zod";

type ConditionStatus = {
  hasUpper: boolean;
  hasLower: boolean;
  hasNumber: boolean;
  hasSymbol: boolean;
  hasMinLength: boolean;
};

const PasswordSchema = z
  .string()
  .min(6, "Password must be at least 6 characters")
  .refine((val) => /[a-z]/.test(val), "Include lowercase letter")
  .refine((val) => /[A-Z]/.test(val), "Include uppercase letter")
  .refine((val) => /\d/.test(val), "Include number")
  .refine(
    (val) => /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(val),
    "Include symbol"
  );

export default function PasswordInput() {
  const [password, setPassword] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const ref = useRef<HTMLInputElement>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [conditions, setConditions] = useState<ConditionStatus>({
    hasUpper: false,
    hasLower: false,
    hasNumber: false,
    hasSymbol: false,
    hasMinLength: false,
  });

  const updateConditions = (password: string) => {
    setConditions({
      hasUpper: /[A-Z]/.test(password),
      hasLower: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSymbol: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password),
      hasMinLength: password.length >= 6,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    updateConditions(newPassword);
  };

  const getStrengthLevel = () => {
    const metConditions = Object.values(conditions).filter(Boolean).length;
    return Math.min(4, Math.max(0, metConditions - 1));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = PasswordSchema.safeParse(password);
    if (result.error) {
      ref.current?.focus();
    }
    // setErrors(result.success ? [] : result.error.errors.map((e) => e.message));
    // If the password is valid, you can send it to the server
  };

  const strengthLevel = getStrengthLevel();

  return (
    <form onSubmit={handleSubmit} className="password-form">
      <div className="input-container">
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          aria-describedby="password-hint"
          ref={ref}
        />

        {isFocused && (
          <div id="password-hint" className="tooltip">
            <div className="base-requirement">
              {(() => {
                switch (strengthLevel) {
                  case 0:
                    return "Must have at least 6 characters";
                  case 1:
                    return "Weeak password";
                  case 2:
                    return "Medium password";
                  case 3:
                    return "Strong password";
                  case 4:
                    return "Very Strong password";
                  default:
                    return "Weak password";
                }
              })()}
              {/* Must have at least 6 characters */}
              {/* {!conditions.hasMinLength && <span className="dot">•</span>}
              {conditions.hasMinLength && <span className="check">✔️</span>} */}
            </div>

            <div className="strength-lines">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className={`strength-line ${
                    i < strengthLevel ? `active-${strengthLevel}` : ""
                  }`}
                />
              ))}
            </div>

            <div className="conditions">
              <div className="condition">
                {conditions.hasUpper && conditions.hasLower ? "✔️" : "•"}
                Upper & lower case letters
              </div>
              <div className="condition">
                {conditions.hasSymbol ? "✔️" : "•"}
                Symbol characters
              </div>
              <div className="condition">
                {conditions.hasNumber ? "✔️" : "•"}
                Number characters
              </div>
            </div>
          </div>
        )}
      </div>

      {errors.length > 0 && (
        <div className="errors">
          {errors.map((error) => (
            <div key={error} className="error">
              {error}
            </div>
          ))}
        </div>
      )}

      <button type="submit">Submit</button>
      <style jsx>{`
        .password-form {
          max-width: 300px;
          margin: 2rem;
          position: relative;
        }

        .input-container {
          position: relative;
          margin-bottom: 1rem;
        }

        input {
          width: 100%;
          padding: 0.5rem;
          margin-top: 0.5rem;
          border: 1px solid #ccc;
          border-radius: 4px;
        }

        .tooltip {
          position: absolute;
          top: 0;
          left: 0;
          top: calc(100% + 0.5rem);
          width: 100%;
          padding: 1rem;
          border-radius: 4px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          background: white;
          z-index: 10;
          font-size: 0.9rem;
          border: 1px solid #ddd;
        }

        .tooltip::after {
          content: "";
          position: absolute;
          top: 50%;
          right: -8px; /* Position the arrow on the right edge of the tooltip */
          width: 0;
          height: 0;
          border-left: 8px solid solid transparent;
          border-right: 8px solid transparent;
          border-top: 8px solid #ddd; /* Match the tooltip's background */
          transform: translateY(-50%);
        }

        .base-requirement {
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .strength-lines {
          display: flex;
          gap: 2px;
          margin-bottom: 1rem;
        }

        .strength-line {
          height: 4px;
          flex: 1;
          background: #ddd;
          border-radius: 2px;
          transition: all 0.3s ease;
        }

        .active-0 {
          background: #ff4444;
        }
        .active-1 {
          background: #ffdd44;
        }
        .active-2 {
          background: #a5d6a7;
        }
        .active-3 {
          background: #4caf50;
        }

        .active-4 {
          background: #4caf50;
        }

        .conditions {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .condition {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #666;
        }

        .dot {
          color: #999;
        }

        .check {
          color: #4caf50;
        }

        .errors {
          color: #dc3545;
          margin: 1rem 0;
        }

        .error {
          font-size: 0.9rem;
          margin: 0.25rem 0;
        }

        button {
          padding: 0.5rem 1rem;
          background: #007bff;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          width: 100%;
        }
      `}</style>
    </form>
  );
}
