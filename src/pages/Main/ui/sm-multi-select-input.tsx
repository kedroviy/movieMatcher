import React, { FC, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, ScrollView, Modal } from 'react-native';
import { FilterOption, Option } from '../sm.model';
import { Checkbox, Chip } from 'react-native-ui-lib';
import { Color } from 'styles/colors';
import { ChevronSvgDownIcon, ChevronSvgUpIcon, CrossSvgIcon } from 'shared';

type MultiSelectInputProps<T> = {
  label: string;
  options: Option[];
  selectedOptions: Option[];
  onSelectionChange: (selected: Option[]) => void;
  maxChips?: number;
  placeholder: string;
};

const windowWidth = Dimensions.get('window').width;

export const SMMultiSelectInput: FC<MultiSelectInputProps<FilterOption>> = ({
  label,
  options,
  selectedOptions,
  onSelectionChange,
  maxChips = 2,
  placeholder,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [expandedIds, setExpandedIds] = useState<Array<string | number>>([]);

  const toggleExpanded = (id: string | number) => {
    setExpandedIds(expandedIds.includes(id)
      ? expandedIds.filter(expandedId => expandedId !== id)
      : [...expandedIds, id]
    );
  };

  // const dropdownZIndex = isOpen ? 1000 : 0;

  const handleToggleDropdown = () => setIsOpen(!isOpen);

  const handleSelectOption = (option: Option) => {
    if (option.disabled) return;
    const isSelected = selectedOptions.some(selected => selected.id === option.id);
    if (isSelected) {
      onSelectionChange(selectedOptions.filter(selected => selected.id !== option.id));
    } else {
      onSelectionChange([...selectedOptions, option]);
    }
  };

  const handleRemoveOption = (optionId: string | number) => {
    onSelectionChange(selectedOptions.filter((option) => option.id !== optionId));
  };

  const renderItemWithChildren = (option: Option, level = 0) => {
    const isSelected = selectedOptions.some(selected => selected.id === option.id);
    const isExpanded = expandedIds.includes(option.id);

    const renderChildren = () => (
      option.children && option.children.map((childOption) => renderItemWithChildren(childOption, level + 1))
    );

    return (
      <View key={option.id} style={{ paddingLeft: level * 20 }}>
        <View style={styles.dropdownItemContainer}>
          <Checkbox
            value={isSelected}
            onValueChange={() => !option.disabled && handleSelectOption(option)}
            color={Color.BUTTON_RED}
            style={{ borderRadius: 5 }}
            disabled={option.disabled}
          />
          <TouchableOpacity
            style={styles.dropdownItem}
            onPress={() => option.children ? toggleExpanded(option.id) : handleSelectOption(option)}
            disabled={option.disabled}
          >
            <Text style={{ color: Color.WHITE }}>
              {option.label}
            </Text>
          </TouchableOpacity>
          {option.children && (
            <TouchableOpacity onPress={() => toggleExpanded(option.id)}>
              {isExpanded ? <ChevronSvgUpIcon /> : <ChevronSvgDownIcon />}
            </TouchableOpacity>
          )}
        </View>
        {isExpanded && option.children && option.children.map(childOption => renderItemWithChildren(childOption, level + 1))}
      </View>
    );
  };

  const renderDropdown = () => {
    if (!isOpen) return null;

    return (
      <ScrollView style={styles.dropdown}>
        {options.map((option) => renderItemWithChildren(option))}
      </ScrollView>
    );
  };

  const renderChips = () => {
    if (selectedOptions.length === 0) {
      return <Text style={styles.placeholder}>{placeholder}</Text>;
    }
    const chipsToRender = selectedOptions.slice(0, maxChips);
    const extraCount = selectedOptions.length - maxChips;

    return (
      <>
        {chipsToRender.map((option) => (
          <Chip
            key={option.id}
            label={option.label}
            onPress={() => handleRemoveOption(option.id)}
            dismissIconStyle={{ width: 10, height: 10 }}
            containerStyle={{
              borderColor: Color.WHITE,
              marginHorizontal: 3,
            }}
            labelStyle={{ color: Color.WHITE }}
            rightElement={<CrossSvgIcon />}
          >
            {option.label}
          </Chip>
        ))}
        {extraCount > 0 && <Text style={{ marginLeft: 3, color: Color.WHITE }}>+{extraCount} more</Text>}
      </>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.input}>
        <View style={styles.chipsContainer}>
          {renderChips()}
          <TouchableOpacity onPress={handleToggleDropdown} style={styles.toggleButton}>
            {isOpen ?
              (<ChevronSvgUpIcon />) : (<ChevronSvgDownIcon />)}
          </TouchableOpacity>
        </View>
      </View>
      <View style={{
        position: 'absolute',
        zIndex: 1000,
        top: 85,
      }}>
        {renderDropdown()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: windowWidth - 32,
    marginBottom: 15,
  },
  input: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 5,
    backgroundColor: Color.GRAY_BROWN,
    marginBottom: 5,
    width: windowWidth - 32,
    height: 48,
  },
  chipsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    paddingLeft: 10,
    width: '100%',
  },
  placeholder: {
    color: '#AAAAAA',
  },
  label: {
    fontSize: 14,
    color: Color.WHITE,
    marginBottom: 8,
    fontFamily: 'Roboto',
    top: 0,
  },
  toggleButton: {
    position: 'absolute',
    marginLeft: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    right: 0,
  },
  dropdown: {
    left: 0,
    width: windowWidth - 32,
    backgroundColor: Color.EXTRA_DARK_GRAY,
    maxHeight: 200,
    borderRadius: 5,
  },
  dropdownItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 10,
  },
});
