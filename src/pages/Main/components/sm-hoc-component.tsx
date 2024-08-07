import { Movie } from 'features';
import React from 'react';
import { Dimensions, View } from 'react-native';


type ListProps<Data> = {
    data: Data[];
    renderItem: (item: Data) => JSX.Element;
    EmptyListComponent: React.ComponentType;
};

type MyListItemType = {
    id: string;
    label: string;
    movies: Movie[];
};

const { width } = Dimensions.get('window');

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
        <View style={{
            width: width - 32,
            paddingVertical: 12,
        }}>
            {data.map((item) => renderItem(item))}
        </View>
    );
};
