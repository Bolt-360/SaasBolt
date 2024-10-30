'use client';

import { useState } from "react";

import { SignInFlow } from "../types";
import { SignInCard } from "./sign-in-card";
import { SignUpCard } from "./sign-up-card";
<<<<<<< Updated upstream
import { ForgotPasswordCard } from "./forgot-password-card"
import { MountainIcon } from "@/icons";
=======
import { ForgotPasswordCard } from "./forgot-password-card";
>>>>>>> Stashed changes

/**
 * @returns {JSX.Element}
 */
export const AuthScreen = () => {
  /** @type {[SignInFlow, function(SignInFlow): void]} */
  const [state, setState] = useState('sign-in');

<<<<<<< Updated upstream
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-foreground">Bem Vindo ao App 360</h2>
=======
    return(
        <div className="flex min-h-[100dvh] items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-foreground">Bem Vindo ao App 360</h2>
          </div>
          {state === 'sign-in' ? (
          <SignInCard setState={setState} />
        ) : state === 'sign-up' ? (
          <SignUpCard setState={setState} />
        ) : (
          <ForgotPasswordCard setState={setState} />
        )}
>>>>>>> Stashed changes
        </div>
        {state === 'sign-in' ? (
          <SignInCard setState={setState} />
        ) : state === 'sign-up' ? (
          <SignUpCard setState={setState} />
        ) : (
          <ForgotPasswordCard setState={setState} />
        )}

      </div>
    </div>
  )
}
