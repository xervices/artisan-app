import { AuthHeader } from '@/components/auth-header';
import { Layout } from '@/components/layout';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Text } from '@/components/ui/text';
import { View } from 'react-native';

export default function Screen() {
  return (
    <Layout
      useBackground
      stickyHeader={
        <View className="pb-4">
          <AuthHeader title="Notifications" />
        </View>
      }>
      <View className="flex-1 gap-6">
        <Accordion className="gap-4" type="single" collapsible>
          {new Array(6).fill(0).map((_, index) => (
            <AccordionItem
              key={index}
              className="rounded-[8px] bg-[#F4F4F5] px-4 py-1"
              value={`Item-${index}`}>
              <AccordionTrigger>
                <View className="flex gap-2">
                  <View className="flex flex-row items-center gap-1">
                    <View className="flex h-4 w-4 items-center justify-center rounded-full bg-[#FE6A00]">
                      <View className="h-2 w-2 rounded-full bg-white" />
                    </View>

                    <Text className="font-cabinet-extrabold text-sm text-primary">Xervices</Text>

                    <Text className="text-xs text-[#737381]">now</Text>
                  </View>

                  <Text className="font-cabinet-bold text-[#737381]">Hi Alex baker!</Text>
                </View>
              </AccordionTrigger>
              <AccordionContent>
                <Text className="text-sm text-[#737381]">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit ut aliquam, purus sit amet
                  luctus venenatis, lectus magna fringilla urna, porttitor
                </Text>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </View>
    </Layout>
  );
}
