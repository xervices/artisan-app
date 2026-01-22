import { queryOptions, mutationOptions } from '@tanstack/react-query';
import { apiClient, publicApiClient } from './client';
import { tokenStorage } from './token-storage';
import { getErrorMessage, RequestBody } from './helpers';
import { useAuthStore } from '@/store/auth-store';
import { Platform } from 'react-native';

const normalizePath = (uri: string) => (Platform.OS === 'ios' ? uri.replace('file://', '') : uri);

export const api = {
  // Server Health endpoints
  health: () =>
    queryOptions({
      queryKey: ['health'],
      queryFn: async () => {
        const { data } = await publicApiClient.GET('/api/health');

        return data;
      },
    }),
  ping: () =>
    queryOptions({
      queryKey: ['health', 'ping'],
      queryFn: async () => {
        const { data } = await publicApiClient.GET('/api/health/ping');

        return data;
      },
    }),

  // Authentication endpoints
  login: () => {
    return {
      mutationFn: async (credentials: RequestBody<'/api/auth/login', 'post'>) => {
        const { data, error } = await apiClient.POST('/api/auth/login', {
          body: credentials,
        });

        if (error) {
          throw new Error(getErrorMessage(error, 'Login failed'));
        }

        if (data.user.role === 'user') {
          throw new Error(
            getErrorMessage({
              message:
                'Unauthorized: This account is not associated with an artisan, install the Xervices app and login.',
            })
          );
        }

        if (data?.tokens) {
          await tokenStorage.setTokens(data.tokens.accessToken, data.tokens.refreshToken);
        }

        if (data.user) {
          useAuthStore.getState().setUser(data.user);
        }

        return data;
      },
    };
  },
  register: () => {
    return {
      mutationFn: async (credentials: RequestBody<'/api/auth/register', 'post'>) => {
        const { data, error } = await apiClient.POST('/api/auth/register', {
          body: credentials,
        });

        if (error) {
          throw new Error(getErrorMessage(error, 'Registration failed'));
        }

        if (data?.tokens) {
          await tokenStorage.setTokens(data.tokens.accessToken, data.tokens.refreshToken);
        }

        if (data.user) {
          useAuthStore.getState().setUser(data.user);
        }

        return data;
      },
    };
  },
  verifyAccount: () => {
    return {
      mutationFn: async (credentials: RequestBody<'/api/auth/verify', 'post'>) => {
        const { data, error } = await apiClient.POST('/api/auth/verify', {
          body: credentials,
        });

        if (error) {
          throw new Error(getErrorMessage(error, 'Account verification failed'));
        }

        return data;
      },
    };
  },
  resendVerificationCode: () => {
    return {
      mutationFn: async (credentials: RequestBody<'/api/auth/resend-verification', 'post'>) => {
        const { data, error } = await apiClient.POST('/api/auth/resend-verification', {
          body: credentials,
        });

        if (error) {
          throw new Error(getErrorMessage(error, 'Account verification failed'));
        }

        return data;
      },
    };
  },
  forgotPassword: () => {
    return {
      mutationFn: async (credentials: RequestBody<'/api/auth/forgot-password', 'post'>) => {
        const { data, error } = await apiClient.POST('/api/auth/forgot-password', {
          body: credentials,
        });

        if (error) {
          throw new Error(getErrorMessage(error, 'Forgot password request failed'));
        }

        return data;
      },
    };
  },
  resetPassword: () => {
    return {
      mutationFn: async (credentials: RequestBody<'/api/auth/reset-password', 'post'>) => {
        const { data, error } = await apiClient.POST('/api/auth/reset-password', {
          body: credentials,
        });

        if (error) {
          throw new Error(getErrorMessage(error, 'Reset password request failed'));
        }

        return data;
      },
    };
  },
  changePassword: () => {
    return {
      mutationFn: async (credentials: RequestBody<'/api/auth/change-password', 'post'>) => {
        const { data, error } = await apiClient.POST('/api/auth/change-password', {
          body: credentials,
        });

        if (error) {
          throw new Error(getErrorMessage(error, 'Change password request failed'));
        }

        return data;
      },
    };
  },
  refreshToken: () => {
    return {
      mutationFn: async (credentials: RequestBody<'/api/auth/refresh', 'post'>) => {
        const { data, error } = await apiClient.POST('/api/auth/refresh', {
          body: credentials,
        });

        if (error) {
          throw new Error(getErrorMessage(error, 'Refresh access request failed'));
        }

        return data;
      },
    };
  },
  logout: () => {
    return {
      mutationFn: async (credentials: RequestBody<'/api/auth/logout', 'post'>) => {
        const { data, error } = await apiClient.POST('/api/auth/logout', {
          body: credentials,
          params: {
            header: {
              authorization: '',
            },
          },
        });

        if (error) {
          throw new Error(getErrorMessage(error, 'Logout request failed'));
        }

        return data;
      },
    };
  },

  // User management endpoints
  getCurrentUser: () =>
    queryOptions({
      queryKey: ['users', 'me'],
      queryFn: async () => {
        const { data } = await apiClient.GET('/api/users/me');

        if (data) {
          useAuthStore.getState().setUser(data);
        }

        return data;
      },
    }),
  updateProfile: () => {
    return {
      mutationFn: async (credentials: RequestBody<'/api/users/me', 'patch'>) => {
        const formData = new FormData();
        const user = useAuthStore.getState().user;

        // Define fields to append (excluding avatar which needs special handling)
        const fields = ['fullName', 'address', 'bio', 'city', 'country', 'state', 'postalCode'];

        // Append only non-empty fields
        fields.forEach((field) => {
          const value = credentials[field];

          // @ts-ignore
          const prevValue: string = user?.profile[field];

          if (value !== undefined && value !== null && value !== '' && prevValue !== value) {
            formData.append(field, String(value));
          }
        });

        // Handle avatar file upload
        // @ts-ignore
        if (credentials.avatarUrl && credentials.avatarUrl !== user?.profile?.avatarUrl) {
          // @ts-ignore
          const extension = credentials.avatarMimeType === 'image/png' ? 'png' : 'jpg';

          const file = {
            // @ts-ignore
            uri: normalizePath(credentials.avatarUrl),
            // @ts-ignore - avatarMimeType sent from form but not specified in api
            type: credentials.avatarMimeType || 'image/jpeg',
            name: `avatar_${Date.now()}}.${extension}`,
          };

          // @ts-ignore - FormData typing issue in React Native
          formData.append('avatar', file);
        }

        const { data, error } = await apiClient.PATCH('/api/users/me', {
          // @ts-ignore - FormData not properly typed in openapi-fetch
          body: formData,
          bodySerializer: () => formData, // Prevent body serialization
        });

        if (error) {
          throw new Error(getErrorMessage(error, 'Profile update failed'));
        }

        return data;
      },
    };
  },
  updateLocation: () => {
    return {
      mutationFn: async (credentials: RequestBody<'/api/users/location', 'patch'>) => {
        const { data, error } = await apiClient.PATCH('/api/users/location', {
          body: credentials,
        });

        if (error) {
          throw new Error(getErrorMessage(error, 'Location update failed'));
        }

        return data;
      },
    };
  },
  deleteAccount: () => {
    return {
      mutationFn: async (credentials: RequestBody<'/api/users/me', 'delete'>) => {
        const { data, error } = await apiClient.DELETE('/api/users/me');

        if (error) {
          throw new Error(getErrorMessage(error, 'Delete account failed'));
        }

        return data;
      },
    };
  },

  // Artisan endpoints
  onboardArtisan: () => {
    return {
      mutationFn: async (credentials: RequestBody<'/api/artisans/onboard', 'post'>) => {
        const formData = new FormData();

        const fields = [
          'categoryIds',
          'identificationType',
          'identificationNumber',
          'yearsOfExperience',
          'professionalLicenseNumber',
          'licenseIssueState',
          'licenseIssueDate',
        ] as const;

        // Append only non-empty fields
        fields.forEach((field) => {
          const value = credentials[field];

          if (value !== undefined && value !== null && value !== '') {
            if (field === 'categoryIds') {
              // @ts-ignore
              value?.forEach((category) => {
                if (category) {
                  formData.append(field, String(category));
                }
              });
            } else {
              formData.append(field, String(value));
            }
          }
        });

        // @ts-ignore
        if (credentials.certifications && credentials.certifications.length > 0) {
          // @ts-ignore
          credentials.certifications.forEach((cert, index) => {
            const file = {
              uri: normalizePath(cert.uri),
              type: cert.mimeType || 'application/pdf',
              name: cert.name || `certification_${index}_${Date.now()}`,
            };
            // @ts-ignore - FormData typing issue in React Native
            formData.append('certifications', file);
          });
        }

        // @ts-ignore
        if (credentials.previousJobs && credentials.previousJobs.length > 0) {
          // @ts-ignore
          credentials.previousJobs.forEach((cert, index) => {
            const file = {
              uri: normalizePath(cert.uri),
              type: cert.mimeType || 'application/pdf',
              name: cert.name || `certification_${index}_${Date.now()}`,
            };
            // @ts-ignore - FormData typing issue in React Native
            formData.append('previousJobs', file);
          });
        }

        const { data, error } = await apiClient.POST('/api/artisans/onboard', {
          // @ts-ignore - FormData not properly typed in openapi-fetch
          body: formData,
          bodySerializer: () => formData, // Prevent body serialization
        });

        console.log(error);

        if (error) {
          throw new Error(getErrorMessage(error, 'Professional profile update failed'));
        }

        return data;
      },
    };
  },
  updateArtisan: () => {
    return {
      mutationFn: async (credentials: RequestBody<'/api/artisans/me', 'patch'>) => {
        const formData = new FormData();

        const fields = [
          'categoryIds',
          'yearsOfExperience',
          'professionalLicenseNumber',
          'licenseIssueState',
          'licenseIssueDate',
        ] as const;

        // Append only non-empty fields
        fields.forEach((field) => {
          const value = credentials[field];

          if (value !== undefined && value !== null && value !== '') {
            if (field === 'categoryIds') {
              // @ts-ignore
              value?.forEach((category) => {
                if (category) {
                  formData.append(field, String(category));
                }
              });
            } else {
              formData.append(field, String(value));
            }
          }
        });

        // @ts-ignore
        if (credentials.certifications && credentials.certifications.length > 0) {
          // @ts-ignore
          credentials.certifications.forEach((cert, index) => {
            const file = {
              uri: normalizePath(cert.uri),
              type: cert.mimeType || 'application/pdf',
              name: cert.name || `certification_${index}_${Date.now()}`,
            };
            // @ts-ignore - FormData typing issue in React Native
            formData.append('certifications', file);
          });
        }

        // @ts-ignore
        if (credentials.previousJobs && credentials.previousJobs.length > 0) {
          // @ts-ignore
          credentials.previousJobs.forEach((cert, index) => {
            const file = {
              uri: normalizePath(cert.uri),
              type: cert.mimeType || 'application/pdf',
              name: cert.name || `certification_${index}_${Date.now()}`,
            };
            // @ts-ignore - FormData typing issue in React Native
            formData.append('previousJobs', file);
          });
        }

        const { data, error } = await apiClient.PATCH('/api/artisans/me', {
          // @ts-ignore - FormData not properly typed in openapi-fetch
          body: formData,
          bodySerializer: () => formData, // Prevent body serialization
        });

        console.log(error);

        if (error) {
          throw new Error(getErrorMessage(error, 'Professional profile update failed'));
        }

        return data;
      },
    };
  },
  getCurrentArtisanProfile: () =>
    queryOptions({
      queryKey: ['artisans', 'me'],
      queryFn: async () => {
        const { data } = await apiClient.GET('/api/artisans/me');

        return data;
      },
    }),
  verifyNIN: () => {
    return {
      mutationFn: async (credentials: RequestBody<'/api/artisans/verify-nin', 'post'>) => {
        const { data, error } = await apiClient.POST('/api/artisans/verify-nin', {
          body: credentials,
        });

        if (error) {
          throw new Error(getErrorMessage(error, 'NIN Verification failed'));
        }

        return data;
      },
    };
  },
  getLevels: () =>
    queryOptions({
      queryKey: ['levels', 'all'],
      queryFn: async () => {
        const { data } = await apiClient.GET('/api/artisans/levels');

        return data;
      },
    }),
  getMyLevel: () =>
    queryOptions({
      queryKey: ['level', 'me'],
      queryFn: async () => {
        const { data } = await apiClient.GET('/api/artisans/me/level');

        return data;
      },
    }),
  toggleAvailability: () => {
    return {
      mutationFn: async (credentials: RequestBody<'/api/artisans/availability', 'patch'>) => {
        const { data, error } = await apiClient.PATCH('/api/artisans/availability', {
          body: credentials,
        });

        if (error) {
          throw new Error(getErrorMessage(error, 'Availability toggle request failed'));
        }

        return data;
      },
    };
  },

  // Categories (Skills) endpoints
  getAllCategories: () =>
    queryOptions({
      queryKey: ['categories'],
      queryFn: async () => {
        const { data } = await apiClient.GET('/api/categories');

        return data;
      },
    }),

  // service endpoints
  getServiceRequest: (id: string) =>
    queryOptions({
      queryKey: ['service-request', id],
      queryFn: async () => {
        const { data } = await apiClient.GET('/api/service-requests/{id}', {
          params: {
            path: {
              id,
            },
          },
        });

        return data;
      },
    }),

  // offers endpoints
  getArtisanOffers: () =>
    queryOptions({
      queryKey: ['artisan', 'offers'],
      queryFn: async () => {
        const { data } = await apiClient.GET('/api/offers/my-offers');

        return data;
      },
    }),
  getOffersHistory: (id: string) =>
    queryOptions({
      queryKey: ['artisan', 'offers', 'history', id],
      queryFn: async () => {
        const { data } = await apiClient.GET('/api/offers/{id}/history', {
          params: {
            path: {
              id,
            },
          },
        });

        return data;
      },
    }),
  getServiceOffers: (id: string) =>
    queryOptions({
      queryKey: ['artisan', 'offers', 'service', id],
      queryFn: async () => {
        const { data } = await apiClient.GET('/api/offers/service-request/{id}', {
          params: {
            path: {
              id,
            },
          },
        });

        return data;
      },
    }),
  createNewOffer: () => {
    return {
      mutationFn: async (credentials: RequestBody<'/api/offers', 'post'>) => {
        const { data, error } = await apiClient.POST('/api/offers', {
          body: credentials,
        });

        if (error) {
          throw new Error(getErrorMessage(error, 'offer failed to send.'));
        }

        return data;
      },
    };
  },
  createCounterOffer: () => {
    return {
      mutationFn: async (credentials: RequestBody<'/api/offers/{id}/counter', 'post'>) => {
        const { data, error } = await apiClient.POST('/api/offers/{id}/counter', {
          body: { amount: credentials.amount, message: credentials.message },
          params: {
            path: {
              // @ts-ignore
              id: credentials?.id,
            },
          },
        });

        if (error) {
          throw new Error(getErrorMessage(error, 'counter offer failed to send.'));
        }

        return data;
      },
    };
  },
  respondToOffer: (id: string) => {
    return {
      mutationFn: async (credentials: RequestBody<'/api/offers/{id}/respond', 'post'>) => {
        const { data, error } = await apiClient.POST('/api/offers/{id}/respond', {
          body: credentials,
          params: {
            path: {
              id,
            },
          },
        });

        if (error) {
          throw new Error(getErrorMessage(error, 'response to offer failed to send.'));
        }

        return data;
      },
    };
  },

  // jobs endpoints
  getUserJobs: () =>
    queryOptions({
      queryKey: ['user', 'jobs'],
      queryFn: async () => {
        const { data } = await apiClient.GET('/api/jobs');

        return data;
      },
    }),

  // promotions, referrals & discounts endpoints
  getMyReferralInfo: () =>
    queryOptions({
      queryKey: ['referrals'],
      queryFn: async () => {
        const { data } = await apiClient.GET('/api/referrals/me');

        return data;
      },
    }),
  getMyDiscounts: () =>
    queryOptions({
      queryKey: ['discounts'],
      queryFn: async () => {
        const { data } = await apiClient.GET('/api/promotions/discounts');

        return data;
      },
    }),
  getMyPromotions: () =>
    queryOptions({
      queryKey: ['promotions'],
      queryFn: async () => {
        const { data } = await apiClient.GET('/api/promotions/me');

        return data;
      },
    }),

  // Support tickets endpoints
  createSupportTicket: () => {
    return {
      mutationFn: async (credentials: RequestBody<'/api/support/tickets', 'post'>) => {
        const { data, error } = await apiClient.POST('/api/support/tickets', {
          body: credentials,
        });

        if (error) {
          throw new Error(getErrorMessage(error, 'Login failed'));
        }

        return data;
      },
    };
  },

  // app ratings endpoints
  submitAppRating: () => {
    return {
      mutationFn: async (credentials: RequestBody<'/api/app-ratings', 'post'>) => {
        const { data, error } = await apiClient.POST('/api/app-ratings', {
          body: credentials,
        });

        if (error) {
          throw new Error(getErrorMessage(error, 'Failed to submit rating'));
        }

        return data;
      },
    };
  },
  getMyAppRatings: () =>
    queryOptions({
      queryKey: ['app-ratings'],
      queryFn: async () => {
        const { data } = await apiClient.GET('/api/app-ratings/me');

        return data;
      },
    }),

  // security endpoints
  checkPinStatus: () => {
    return {
      mutationFn: async (credentials: RequestBody<'/api/security/check-pin-status', 'post'>) => {
        const { data, error } = await apiClient.POST('/api/security/check-pin-status');

        if (error) {
          throw new Error(getErrorMessage(error, 'Failed to check pin status'));
        }

        return data;
      },
    };
  },
  updatePin: () => {
    return {
      mutationFn: async (credentials: RequestBody<'/api/security/pin', 'post'>) => {
        const { data, error } = await apiClient.POST('/api/security/pin', {
          body: credentials,
        });

        if (error) {
          throw new Error(getErrorMessage(error, 'Failed to update pin.'));
        }

        return data;
      },
    };
  },

  // disputes endpoints
  createDispute: () => {
    return {
      mutationFn: async (credentials: RequestBody<'/api/disputes', 'post'>) => {
        const { data, error } = await apiClient.POST('/api/disputes', {
          body: credentials,
        });

        if (error) {
          throw new Error(getErrorMessage(error, 'Failed to create dispute.'));
        }

        return data;
      },
    };
  },
  getMyDisputes: () =>
    queryOptions({
      queryKey: ['disputes'],
      queryFn: async () => {
        const { data } = await apiClient.GET('/api/disputes');

        return data;
      },
    }),
  getDisputeDetail: (id: string) =>
    queryOptions({
      queryKey: ['disputes', id],
      queryFn: async () => {
        const { data } = await apiClient.GET('/api/disputes/{id}', {
          params: {
            path: {
              id,
            },
          },
        });

        return data;
      },
    }),
  addDisputeEvidence: (id: string) => {
    return {
      mutationFn: async (credentials: RequestBody<'/api/disputes/{id}/evidence', 'post'>) => {
        const { data, error } = await apiClient.POST('/api/disputes/{id}/evidence', {
          body: credentials,
          params: {
            path: {
              id,
            },
          },
        });

        if (error) {
          throw new Error(getErrorMessage(error, 'Failed to add dispute evidence.'));
        }

        return data;
      },
    };
  },
};
