// src/components/doctors-container.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import { RefreshCw, User, Mail, Phone } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DynamicPagination } from "@/components/Pagination";
import {
  useAllDoctors,
} from "@/features/doctors/hooks/useDoctors";
import {
    DoctorForDoctor,
  DoctorsQueryParams,
} from "@/features/doctors/types/doctor";
import { DoctorSearch, DoctorSpecializationFilter } from "@/features/doctors/components/doctor-search";
import { DoctorSort } from "@/features/doctors/components/doctor-sort";
import { DoctorsSkeleton } from "@/features/doctors/components/doctors-skeleton";
import { useAuth } from "@/features/authentication/hooks/useAuth";

// Doctor interface matching your response


export default function Page() {
  const { token } = useAuth();
  const { toast } = useToast();
  const [queryParams, setQueryParams] = useState<DoctorsQueryParams>({
    page: 1,
    pageSize: 9,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [specializationFilter, setSpecializationFilter] = useState("");
  const [sortBy, setSortBy] = useState("name");

  // Debounce search to avoid too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setQueryParams((prev) => ({
        ...prev,
        q: searchTerm || undefined,
        page: 1, // Reset to first page when searching
      }));
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Update query params when filters change
  useEffect(() => {
    setQueryParams((prev) => ({
      ...prev,
      specialization: specializationFilter || undefined,
      page: 1, // Reset to first page when filtering
    }));
  }, [specializationFilter]);

  // Update query params when sort changes
  useEffect(() => {
    setQueryParams((prev) => ({
      ...prev,
      sort: sortBy,
    }));
  }, [sortBy]);

  const {
    data: response,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useAllDoctors(queryParams, token || "");

  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
  }, []);

  const handleSpecializationChange = useCallback((specialization: string) => {
    setSpecializationFilter(specialization);
  }, []);

  const handleClearFilters = useCallback(() => {
    setSpecializationFilter("");
  }, []);

  const handleSortChange = useCallback((sort: string) => {
    setSortBy(sort);
  }, []);

  const handlePageChange = (page: number) => {
    setQueryParams((prev) => ({ ...prev, page }));
  };

  const handlePageSizeChange = (pageSize: number) => {
    setQueryParams((prev) => ({ ...prev, pageSize, page: 1 }));
  };

  const handleRefresh = () => {
    refetch();
  };

  // Function to get primary contact information
  const getPrimaryContactInfo = (doctor: DoctorForDoctor) => {
    const primaryEmail = doctor.Emails?.find(email => email.isPrimary)?.emailAddress || doctor.PrimaryEmail;
    const primaryPhone = doctor.Phones?.find(phone => phone.isPrimary)?.phoneNumber || doctor.PrimaryPhone;
    
    return { primaryEmail, primaryPhone };
  };

  // Function to handle WhatsApp contact
  const handleWhatsAppContact = (phoneNumber: string) => {
    const cleanPhone = phoneNumber.replace(/\D/g, ''); // Remove non-digit characters
    const whatsappUrl = `https://wa.me/${cleanPhone}`;
    window.open(whatsappUrl, '_blank');
  };

  // Function to handle email contact
  const handleEmailContact = (email: string) => {
    window.location.href = `mailto:${email}`;
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <User className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-2 text-sm font-medium">
              Authentication required
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Please log in to view doctors.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <User className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-2 text-sm font-medium">Failed to load doctors</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {error instanceof Error ? error.message : "An error occurred"}
            </p>
            <div className="mt-6">
              <Button onClick={handleRefresh} variant="outline">
                <RefreshCw className="mr-2 h-4 w-4" />
                Try again
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold">Doctors</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                {response?.pagination?.totalCount || response?.data?.length || 0} doctor
                {(response?.pagination?.totalCount || response?.data?.length || 0) !== 1 ? "s" : ""} found
              </p>
            </div>

            <div className="flex items-center gap-3 mt-4 sm:mt-0">
              <Button
                onClick={handleRefresh}
                disabled={isRefetching}
                variant="outline"
              >
                <RefreshCw
                  className={`mr-2 h-4 w-4 ${
                    isRefetching ? "animate-spin" : ""
                  }`}
                />
                Refresh
              </Button>
            </div>
          </div>

          {/* Search, Filter, and Sort Controls */}
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <DoctorSearch
              searchTerm={searchTerm}
              onSearchChange={handleSearchChange}
            />

            <div className="flex gap-2">
              <DoctorSpecializationFilter
                specialization={specializationFilter}
                onSpecializationChange={handleSpecializationChange}
                onClear={handleClearFilters}
              />

              <DoctorSort sortBy={sortBy} onSortChange={handleSortChange} />
            </div>
          </div>

          {/* Active Filters Display */}
          {(searchTerm || specializationFilter) && (
            <div className="flex flex-wrap gap-2 mt-4">
              {searchTerm && (
                <Badge variant="secondary" className="px-3 py-1">
                  Search: &quot;{searchTerm}&quot;
                </Badge>
              )}
              {specializationFilter && (
                <Badge variant="secondary" className="px-3 py-1">
                  Specialization: {specializationFilter}
                </Badge>
              )}
            </div>
          )}
        </div>

        {isLoading ? (
          <DoctorsSkeleton />
        ) : response?.data && response.data.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
            {response.data.map((doctor: DoctorForDoctor) => {
              const { primaryEmail, primaryPhone } = getPrimaryContactInfo(doctor);
              
              return (
                <div
                  key={doctor.Id}
                  className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 p-6"
                >
                  {/* Doctor Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Dr. {doctor.FirstName} {doctor.LastName}
                      </h3>
                      <p className="text-sm text-gray-600">{doctor.Specialization}</p>
                    </div>
                    <Badge variant={doctor.Gender === "Male" ? "default" : "secondary"}>
                      {doctor.Gender}
                    </Badge>
                  </div>

                  {/* Doctor Details */}
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="font-medium">Age:</span>
                      <span className="ml-2">{doctor.Age} years</span>
                    </div>

                    {/* Email */}
                    {primaryEmail && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm text-gray-600">
                          <Mail className="h-4 w-4 mr-2" />
                          <span className="truncate">{primaryEmail}</span>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEmailContact(primaryEmail)}
                          className="ml-2"
                        >
                          Contact
                        </Button>
                      </div>
                    )}

                    {/* Phone */}
                    {primaryPhone && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm text-gray-600">
                          <Phone className="h-4 w-4 mr-2" />
                          <span>{primaryPhone}</span>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleWhatsAppContact(primaryPhone)}
                          className="ml-2"
                        >
                          WhatsApp
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Additional Emails */}
                  {doctor.Emails && doctor.Emails.filter(email => !email.isPrimary).length > 0 && (
                    <div className="mb-3">
                      <p className="text-xs font-medium text-gray-500 mb-1">Additional Emails:</p>
                      <div className="space-y-1">
                        {doctor.Emails.filter(email => !email.isPrimary).map((email) => (
                          <div key={email.id} className="flex items-center text-xs text-gray-600">
                            <Mail className="h-3 w-3 mr-1" />
                            <span>{email.emailAddress}</span>
                            <Badge variant="outline" className="ml-2 text-xs">
                              {email.label}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Additional Phones */}
                  {doctor.Phones && doctor.Phones.filter(phone => !phone.isPrimary).length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-gray-500 mb-1">Additional Phones:</p>
                      <div className="space-y-1">
                        {doctor.Phones.filter(phone => !phone.isPrimary).map((phone) => (
                          <div key={phone.id} className="flex items-center text-xs text-gray-600">
                            <Phone className="h-3 w-3 mr-1" />
                            <span>{phone.phoneNumber}</span>
                            <Badge variant="outline" className="ml-2 text-xs">
                              {phone.label}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <User className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-2 text-sm font-medium">No doctors found</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {searchTerm || specializationFilter
                ? "Try adjusting your search or filters"
                : "No doctors available at the moment."}
            </p>
            {(searchTerm || specializationFilter) && (
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setSearchTerm("");
                  handleClearFilters();
                }}
              >
                Clear all filters
              </Button>
            )}
          </div>
        )}

        {response?.pagination && response.pagination.totalPages > 1 && (
          <DynamicPagination
            pagination={response.pagination}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />
        )}
      </div>
    </div>
  );
}