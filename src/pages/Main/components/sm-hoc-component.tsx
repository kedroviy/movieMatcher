import React from 'react';
import { View } from 'react-native';


type ListProps<Data> = {
    data: Data[];
    renderItem: (item: Data) => JSX.Element;
    EmptyListComponent: React.ComponentType;
};

type MyListItemType = {
    id: number;
    title: string;
};

export const withListOrEmptyState = <Data,>(Component: React.ComponentType<ListProps<Data>>) => {
    return (props: ListProps<Data>) => {
        const { data, EmptyListComponent } = props;

        if (data && data.length > 0) {
            return <Component {...props} />;
        } else {
            return <EmptyListComponent />;
        }
    };
};

export const MyMovieListComponent = ({ data, renderItem }: ListProps<MyListItemType>) => {
    return (
        <View>
            {data.map((item) => renderItem(item))}
        </View>
    );
};
