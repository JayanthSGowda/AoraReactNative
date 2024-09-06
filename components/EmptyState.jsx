import { View, Text, Image } from 'react-native'
import CustomButton from './CustomButton'

import { images } from '../constants'
import { router } from 'expo-router'

const EmptyState = ({ title, subtitle }) => {
  return (
    <View className="justify-center items-center px-4">
      <Image source={images.empty} className="w-[270px] h-[215px]"/>
        <Text className="text-xl text-center font-psemibold text-white mt-2">
            {title}
        </Text>
        <Text className="font-pmedium text-sm text-gray-100 mt-2">
            {subtitle}
        </Text>

        <CustomButton
            title="Create Video"
            handlePress={() => router.push('/create')}
            containterStyles="w-full my-5"
        />
    </View>
  )
}

export default EmptyState