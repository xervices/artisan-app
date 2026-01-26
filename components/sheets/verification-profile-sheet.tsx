import { Dimensions, Pressable, View } from 'react-native';
import ActionSheet, { SheetManager, SheetProps } from 'react-native-actions-sheet';
import { Text } from '../ui/text';
import { ArrowLeft } from 'lucide-react-native';
import { WebView, WebViewMessageEvent, WebViewNavigation } from 'react-native-webview';
import { useState } from 'react';
import { ActivityIndicator } from 'react-native';

const screenHeight = Dimensions.get('window').height;

// const widgetId = '697360505dae32fe5044be3b'

export interface VerificationUserData {
  firstName?: string;
  middleName?: string;
  lastName?: string;
  email?: string;
  dob?: string; // Format: YYYY-MM-DD
}

export interface VerificationMetadata {
  userId?: string;
  [key: string]: string | undefined;
}

export interface VerificationResult {
  status: 'success' | 'error' | 'cancelled';
  data?: Record<string, unknown>;
  message?: string;
}

export interface VerificationProfileSheetPayload {
  userData?: VerificationUserData;
  metadata?: VerificationMetadata;
  onSuccess?: (result: VerificationResult) => void;
  onError?: (error: VerificationResult) => void;
  onClose?: () => void;
}

const buildVerificationUrl = (
  userData?: VerificationUserData,
  metadata?: VerificationMetadata
): string => {
  const widgetId = '697360505dae32fe5044be3b';
  const baseUrl = 'https://identity.dojah.io';
  const params = new URLSearchParams();

  params.append('widget_id', widgetId);

  // Add user data parameters
  if (userData) {
    if (userData.firstName) params.append('user_data[first_name]', userData.firstName);
    if (userData.middleName) params.append('user_data[middle_name]', userData.middleName);
    if (userData.lastName) params.append('user_data[last_name]', userData.lastName);
    if (userData.email) params.append('user_data[email]', userData.email);
    if (userData.dob) params.append('user_data[dob]', userData.dob);
  }

  // Add metadata parameters
  if (metadata) {
    Object.entries(metadata).forEach(([key, value]) => {
      if (value) params.append(`metadata[${key}]`, value);
    });
  }

  return `${baseUrl}?${params.toString()}`;
};

export function VerificationProfileSheet(props: SheetProps<'verification-profile-sheet'>) {
  const [isLoading, setIsLoading] = useState(true);

  const { userData, metadata, onSuccess, onError, onClose } = props.payload ?? {};

  const verificationUrl = buildVerificationUrl(userData, metadata);

  const handleWebViewMessage = (event: WebViewMessageEvent) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);

      // Check if the message contains the success string
      if (
        data.type === 'success_message' ||
        data.text?.includes('Your verification has been successfully completed.')
      ) {
        onSuccess?.({
          status: 'success',
          data: data.data || data,
          message: 'Verification completed successfully',
        });
        SheetManager.hide('verification-profile-sheet');
        return;
      }

      if (data.type === 'success' || data.status === 'success') {
        onSuccess?.({
          status: 'success',
          data: data.data || data,
          message: data.message,
        });
        SheetManager.hide('verification-profile-sheet');
      } else if (data.type === 'error' || data.status === 'error') {
        onError?.({
          status: 'error',
          data: data.data || data,
          message: data.message || 'Verification failed',
        });
      } else if (data.type === 'close' || data.status === 'close') {
        handleClose();
      }
    } catch (error) {
      console.error('Error parsing WebView message:', error);
    }
  };

  const handleNavigationStateChange = (navState: WebViewNavigation) => {
    const { url } = navState;

    // Check for success/error URLs if Dojah redirects
    if (url.includes('success') || url.includes('verification-complete')) {
      onSuccess?.({
        status: 'success',
        message: 'Verification completed successfully',
      });
      SheetManager.hide('verification-profile-sheet');
    } else if (url.includes('error') || url.includes('verification-failed')) {
      onError?.({
        status: 'error',
        message: 'Verification failed',
      });
    }
  };

  const handleClose = () => {
    onClose?.();
    SheetManager.hide('verification-profile-sheet');
  };

  const handleWebViewError = (syntheticEvent: { nativeEvent: { description: string } }) => {
    const { description } = syntheticEvent.nativeEvent;
    console.error('WebView error:', description);

    onError?.({
      status: 'error',
      message: description || 'WebView failed to load',
    });
  };

  return (
    <ActionSheet
      gestureEnabled={false}
      closeOnTouchBackdrop={false}
      containerStyle={{
        backgroundColor: '#FFFFFF',
      }}
      indicatorStyle={{
        width: 38,
        height: 6,
        backgroundColor: '#FFF4EA',
      }}>
      <View style={{ height: screenHeight * 0.9 }} className="flex gap-4 p-4">
        <View className="flex w-full flex-row items-center gap-4">
          <Pressable onPress={handleClose} className="h-8 w-8 justify-center">
            <ArrowLeft size={24} color={'#B4B4BC'} />
          </Pressable>
          <Text className="flex-1 font-cabinet-bold text-lg text-[#1B1B1E]">
            Identity Verification
          </Text>
        </View>

        <View className="relative flex-1 overflow-hidden rounded-lg">
          {isLoading && (
            <View className="absolute inset-0 z-10 flex items-center justify-center bg-white">
              <ActivityIndicator size="large" color="#FF7C1F" />
              <Text className="mt-2 text-sm text-[#737381]">Loading verification...</Text>
            </View>
          )}

          <WebView
            originWhitelist={['*']}
            source={{ uri: verificationUrl }}
            allowsInlineMediaPlayback={true}
            mediaPlaybackRequiresUserAction={false}
            startInLoadingState={true}
            javaScriptEnabled
            domStorageEnabled
            onMessage={handleWebViewMessage}
            onNavigationStateChange={handleNavigationStateChange}
            onError={handleWebViewError}
            onLoadStart={() => setIsLoading(true)}
            onLoadEnd={() => setIsLoading(false)}
            injectedJavaScript={`
              (function() {
                const observer = new MutationObserver(function(mutations) {
                  const bodyText = document.body.innerText;
                  if (bodyText.includes('Your verification has been successfully completed.')) {
                    window.ReactNativeWebView.postMessage(JSON.stringify({
                      type: 'success_message',
                      text: bodyText
                    }));
                  }
                });
                observer.observe(document.body, { childList: true, subtree: true, characterData: true });
              })();
            `}
            style={{ flex: 1 }}
          />
        </View>
      </View>
    </ActionSheet>
  );
}
