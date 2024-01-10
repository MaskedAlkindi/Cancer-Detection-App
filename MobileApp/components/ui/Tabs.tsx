import { FlatList, TouchableOpacity, View } from "react-native";
import { BoldText, RegularText } from "../global";
import { useState } from "react";

type TabsProps = {
  tabTitles: string[];
};

export default function Tabs({ tabTitles }: TabsProps) {
  const [activeTab, setActiveTab] = useState(tabTitles[0]);

  return (
    <View
      style={{
        flexDirection: "row",
        backgroundColor: "#eee",
        height: 40,
        alignItems: "center",
        justifyContent: "center",
        padding: 4,
        borderRadius: 6,
      }}
    >
      {tabTitles.map((title, index: number) => (
        <TouchableOpacity
          onPress={() => setActiveTab(title)}
          key={index}
          style={{
            backgroundColor: activeTab === title ? "#fff" : "#eee",
            flex: 1,
            height: "100%",
            borderRadius: 2,
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: 12,
            paddingVertical: 6,
          }}
        >
          <BoldText style={{ color: activeTab === title ? "#000" : "gray" }}>
            {title}
          </BoldText>
        </TouchableOpacity>
      ))}
    </View>
  );
}
