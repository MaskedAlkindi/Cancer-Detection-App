import { View, TouchableOpacity } from "react-native";
import Button from "./Button";
import { useState } from "react";
import { RegularText } from "../global";
import { Ionicons } from "@expo/vector-icons";

type SelectProps = {
  buttonTitle: string;
  items: string[];
  onSelect: (item: string) => void; // Callback for when an item is selected
};

export default function Select({ buttonTitle, items, onSelect }: SelectProps) {
  const [selectItem, setSelectItem] = useState("");
  const [isSelectShown, setIsSelectShown] = useState(false); // State to show/hide the select options

  const handleSelect = (item: string) => {
    setSelectItem(item);
    setIsSelectShown(false); // Hide the select options after selection
    onSelect(item); // Call the onSelect callback with the selected item
  };

  return (
    <View>
      <View style={{ width: "60%" }}>
        <Button
          variant="outline"
          onPress={() => setIsSelectShown((prev) => !prev)}
          title={selectItem || buttonTitle}
        />

        {isSelectShown && (
          <View
            style={{
              backgroundColor: "#fff",
              borderWidth: 1,
              borderColor: "#d3d3d3",
              padding: 4,
              alignItems: "flex-start",
              gap: 8,
              borderRadius: 6,
              marginTop: 4,
            }}
          >
            {items.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={{
                  width: "100%",
                  borderRadius: 2,
                  paddingVertical: 8,
                  paddingHorizontal: 20,
                  backgroundColor: item === selectItem ? "#eee" : "",
                }}
                onPress={() => handleSelect(item)}
              >
                <RegularText style={{ alignSelf: "flex-start" }}>
                  {item}
                </RegularText>
                {item === selectItem && (
                  <Ionicons
                    name="md-radio-button-on"
                    size={16}
                    color={"gray"}
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    </View>
  );
}
