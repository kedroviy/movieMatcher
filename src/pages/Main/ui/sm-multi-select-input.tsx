import React, { FC, memo, useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, ActivityIndicator, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Option } from '../sm.model';
import { Checkbox, Chip } from 'react-native-ui-lib';
import { Color } from 'styles/colors';
import { ChevronSvgDownIcon, ChevronSvgUpIcon, CrossSvgIcon } from 'shared';
import { getOpenDropdownId, setOpenDropdownId, subscribeOpenDropdown } from './dropdown-open-store';

type MultiSelectInputProps = {
    label: string;
    options: Option[];
    selectedOptions: Option[];
    onSelectionChange: (selected: Option[]) => void;
    maxChips?: number;
    placeholder: string;
    loading?: boolean;
    loadingLabel?: string;
    isOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    /** When set, open state lives outside the parent form so siblings do not re-render. */
    dropdownId?: string;
};

type OptionRowProps = {
    option: Option;
    level: number;
    selectedIds: ReadonlySet<string | number>;
    expandedIds: readonly (string | number)[];
    onSelect: (option: Option) => void;
    onToggleExpanded: (id: string | number) => void;
};

const windowWidth = Dimensions.get('window').width;
const DROPDOWN_VIEWPORT_HEIGHT = 200;
const WINDOW_OVERSCAN = 4;
const WINDOW_MIN_LENGTH = 24;

const subscribeClosed = (): (() => void) => () => undefined;

const OptionRow: FC<OptionRowProps> = memo(function OptionRow({
    option,
    level,
    selectedIds,
    expandedIds,
    onSelect,
    onToggleExpanded,
}) {
    const isSelected = selectedIds.has(option.id);
    const isExpanded = expandedIds.includes(option.id);
    const hasChildren = Boolean(option.children?.length);

    return (
        <View style={{ paddingLeft: level * 20 }}>
            <View style={styles.dropdownItemContainer}>
                <Checkbox
                    value={isSelected}
                    onValueChange={() => !option.disabled && onSelect(option)}
                    color={Color.BUTTON_RED}
                    style={styles.checkbox}
                    disabled={option.disabled}
                />
                <TouchableOpacity
                    style={styles.dropdownItem}
                    onPress={() => (hasChildren ? onToggleExpanded(option.id) : onSelect(option))}
                    disabled={option.disabled}
                >
                    <Text style={styles.optionLabel}>{option.label}</Text>
                </TouchableOpacity>
                {hasChildren ? (
                    <TouchableOpacity onPress={() => onToggleExpanded(option.id)}>
                        {isExpanded ? <ChevronSvgUpIcon /> : <ChevronSvgDownIcon />}
                    </TouchableOpacity>
                ) : null}
            </View>
            {isExpanded && option.children
                ? option.children.map((childOption) => (
                      <OptionRow
                          key={childOption.id}
                          option={childOption}
                          level={level + 1}
                          selectedIds={selectedIds}
                          expandedIds={expandedIds}
                          onSelect={onSelect}
                          onToggleExpanded={onToggleExpanded}
                      />
                  ))
                : null}
        </View>
    );
});

const SMMultiSelectInputComponent: FC<MultiSelectInputProps> = ({
    label,
    options,
    selectedOptions,
    onSelectionChange,
    maxChips = 2,
    placeholder,
    loading = false,
    loadingLabel,
    isOpen: isOpenControlled,
    onOpenChange,
    dropdownId,
}) => {
    const [isOpenInternal, setIsOpenInternal] = useState<boolean>(false);
    const [expandedIds, setExpandedIds] = useState<Array<string | number>>([]);
    const [scrollOffset, setScrollOffset] = useState(0);
    const [rowHeight, setRowHeight] = useState(56);
    const rowIndexRef = useRef(0);
    const isOpenFromStore = useSyncExternalStore(
        dropdownId ? subscribeOpenDropdown : subscribeClosed,
        () => (dropdownId ? getOpenDropdownId() === dropdownId : false),
        () => false,
    );
    const isOpen = dropdownId ? isOpenFromStore : (isOpenControlled ?? isOpenInternal);

    useEffect(() => {
        if (isOpen) {
            return;
        }
        rowIndexRef.current = 0;
        setScrollOffset(0);
    }, [isOpen]);
    const selectedIds = useMemo(
        () => new Set(selectedOptions.map((option) => option.id)),
        [selectedOptions],
    );

    const setIsOpen = (open: boolean): void => {
        if (dropdownId) {
            setOpenDropdownId(open ? dropdownId : null);
            return;
        }
        if (onOpenChange) {
            onOpenChange(open);
            return;
        }
        setIsOpenInternal(open);
    };

    const toggleExpanded = useCallback((id: string | number) => {
        setExpandedIds((current) =>
            current.includes(id) ? current.filter((expandedId) => expandedId !== id) : [...current, id],
        );
    }, []);

    const handleToggleDropdown = () => setIsOpen(!isOpen);

    const handleSelectOption = useCallback(
        (option: Option) => {
            if (option.disabled) {
                return;
            }
            const isSelected = selectedOptions.some((selected) => selected.id === option.id);
            if (isSelected) {
                onSelectionChange(selectedOptions.filter((selected) => selected.id !== option.id));
                return;
            }
            onSelectionChange([...selectedOptions, option]);
        },
        [onSelectionChange, selectedOptions],
    );

    const handleRemoveOption = (optionId: string | number) => {
        onSelectionChange(selectedOptions.filter((option) => option.id !== optionId));
    };

    const isWindowedList = options.length > WINDOW_MIN_LENGTH && options.every((option) => !option.children?.length);
    const visibleOptions = useMemo(() => {
        if (!isWindowedList) {
            return { items: options, paddingTop: 0, paddingBottom: 0 };
        }
        const start = Math.max(0, Math.floor(scrollOffset / rowHeight) - WINDOW_OVERSCAN);
        const visibleCount = Math.ceil(DROPDOWN_VIEWPORT_HEIGHT / rowHeight) + WINDOW_OVERSCAN * 2;
        const end = Math.min(options.length, start + visibleCount);
        return {
            items: options.slice(start, end),
            paddingTop: start * rowHeight,
            paddingBottom: (options.length - end) * rowHeight,
        };
    }, [isWindowedList, options, rowHeight, scrollOffset]);

    const handleDropdownScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        if (!isWindowedList) {
            return;
        }
        const offset = event.nativeEvent.contentOffset.y;
        const nextIndex = Math.floor(offset / rowHeight);
        if (nextIndex === rowIndexRef.current) {
            return;
        }
        rowIndexRef.current = nextIndex;
        setScrollOffset(offset);
    };

    const handleRowLayout = (height: number) => {
        if (!isWindowedList || height <= 0 || Math.abs(height - rowHeight) < 1) {
            return;
        }
        setRowHeight(height);
    };

    const renderDropdown = () => {
        if (!isOpen) {
            return null;
        }
        if (loading) {
            return (
                <View style={[styles.dropdown, styles.dropdownLoading]}>
                    <ActivityIndicator color={Color.BUTTON_RED} />
                    {loadingLabel ? <Text style={styles.loadingText}>{loadingLabel}</Text> : null}
                </View>
            );
        }
        if (options.length === 0) {
            return (
                <View style={[styles.dropdown, styles.dropdownLoading]}>
                    <Text style={styles.loadingText}>{loadingLabel ?? placeholder}</Text>
                </View>
            );
        }
        return (
            <ScrollView
                style={styles.dropdown}
                nestedScrollEnabled
                keyboardShouldPersistTaps="always"
                showsVerticalScrollIndicator
                scrollEventThrottle={16}
                onScroll={handleDropdownScroll}
                contentContainerStyle={{
                    paddingTop: visibleOptions.paddingTop,
                    paddingBottom: visibleOptions.paddingBottom,
                }}
            >
                {visibleOptions.items.map((option, index) => (
                    <View
                        key={option.id}
                        onLayout={
                            isWindowedList && index === 0
                                ? (event) => handleRowLayout(event.nativeEvent.layout.height)
                                : undefined
                        }
                    >
                        <OptionRow
                            option={option}
                            level={0}
                            selectedIds={selectedIds}
                            expandedIds={expandedIds}
                            onSelect={handleSelectOption}
                            onToggleExpanded={toggleExpanded}
                        />
                    </View>
                ))}
            </ScrollView>
        );
    };

    const renderChips = () => {
        if (loading && selectedOptions.length === 0) {
            return <Text style={styles.placeholder}>{loadingLabel ?? placeholder}</Text>;
        }
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
                        dismissIconStyle={styles.dismissIcon}
                        containerStyle={styles.chip}
                        labelStyle={styles.chipLabel}
                        rightElement={<CrossSvgIcon />}
                    >
                        {option.label}
                    </Chip>
                ))}
                {extraCount > 0 && <Text style={styles.extraCount}>+{extraCount} more</Text>}
            </>
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>
            <TouchableOpacity activeOpacity={0.85} onPress={handleToggleDropdown} style={styles.input}>
                <View style={styles.chipsContainer}>
                    {renderChips()}
                    <View style={styles.toggleButton} pointerEvents="none">
                        {isOpen ? <ChevronSvgUpIcon /> : <ChevronSvgDownIcon />}
                    </View>
                </View>
            </TouchableOpacity>
            {isOpen ? (
                <View style={styles.dropdownAnchor} pointerEvents="box-none">
                    {renderDropdown()}
                </View>
            ) : null}
        </View>
    );
};

export const SMMultiSelectInput = memo(SMMultiSelectInputComponent);

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
    dropdownAnchor: {
        position: 'absolute',
        zIndex: 1000,
        top: 85,
        left: 0,
        right: 0,
    },
    dropdown: {
        left: 0,
        width: windowWidth - 32,
        backgroundColor: Color.EXTRA_DARK_GRAY,
        maxHeight: 200,
        borderRadius: 5,
    },
    dropdownLoading: {
        minHeight: 120,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
    },
    loadingText: {
        marginTop: 8,
        color: Color.WHITE,
        textAlign: 'center',
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
    checkbox: {
        borderRadius: 5,
    },
    optionLabel: {
        color: Color.WHITE,
    },
    chip: {
        borderColor: Color.WHITE,
        marginHorizontal: 3,
    },
    chipLabel: {
        color: Color.WHITE,
    },
    dismissIcon: {
        width: 10,
        height: 10,
    },
    extraCount: {
        marginLeft: 3,
        color: Color.WHITE,
    },
});
