import { Text } from '@/components/ui/text';
import * as React from 'react';
import { ScrollView, View } from 'react-native';
import { Layout } from '@/components/layout';
import { AuthHeader } from '@/components/auth-header';

import { PersonalDetails } from '@/components/profile/personal-details';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CertificationDetails } from '@/components/profile/certification-details';

export default function Screen() {
  const [value, setValue] = React.useState('info');

  return (
    <Layout
      useBackground
      scrollable={false}
      stickyHeader={
        <View className="pb-4">
          <AuthHeader title="Personal Details" />
        </View>
      }>
      <View className="flex-1">
        <Tabs value={value} onValueChange={setValue} className="w-full">
          <TabsList className="h-[52px] w-full border-none p-0">
            <TabsTrigger
              className="h-full w-1/2 rounded-none border-none"
              value="info"
              style={{
                borderColor: undefined,
                borderWidth: 0,
                backgroundColor: value === 'info' ? '#1B1B1E' : '#F4F4F5',
              }}>
              <Text
                className="font-cabinet-bold text-sm"
                style={{
                  color: value === 'info' ? '#FFF4EA' : '#737381',
                }}>
                Info
              </Text>
            </TabsTrigger>
            <TabsTrigger
              className="h-full w-1/2 rounded-none border-none"
              value="cert"
              style={{
                borderColor: undefined,
                borderWidth: 0,
                backgroundColor: value === 'cert' ? '#1B1B1E' : '#F4F4F5',
              }}>
              <Text
                className="font-cabinet-bold text-sm"
                style={{
                  color: value === 'cert' ? '#FFF4EA' : '#737381',
                }}>
                Certification
              </Text>
            </TabsTrigger>
          </TabsList>

          {/* Info content */}
          <ScrollView
            contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}
            showsVerticalScrollIndicator={false}>
            <TabsContent value="info" className="flex gap-6 pt-4">
              <PersonalDetails />
            </TabsContent>

            <TabsContent value="cert" className="flex gap-6 pt-4">
              <CertificationDetails />
            </TabsContent>
          </ScrollView>
        </Tabs>
      </View>
    </Layout>
  );
}
