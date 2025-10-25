"use client"
import { useAuthContext } from "@/context/AuthContext";
import { useAuth } from "@/features/authentication/hooks/useAuth";
import { HealthcareFacilitiesContainer } from "@/features/health-care-facility/components/healthcare-facilities-container";
import React from "react";

export default function Page() {
  const {token} = useAuth();
  console.log(token)
  return <HealthcareFacilitiesContainer token={token!} />;
}
