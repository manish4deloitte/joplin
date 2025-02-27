const React = require('react');
import { useState, useCallback, useMemo } from 'react';
import { FAB, Portal } from 'react-native-paper';
import { _ } from '@joplin/lib/locale';
import { Dispatch } from 'redux';
const Icon = require('react-native-vector-icons/Ionicons').default;

// eslint-disable-next-line no-undef -- Don't know why it says React is undefined when it's defined above
type FABGroupProps = React.ComponentProps<typeof FAB.Group>;

type OnButtonPress = ()=> void;
interface ButtonSpec {
	icon: string;
	label: string;
	color?: string;
	onPress?: OnButtonPress;
}

interface ActionButtonProps {
	buttons?: ButtonSpec[];

	// If not given, an "add" button will be used.
	mainButton?: ButtonSpec;
	dispatch: Dispatch;
}

const defaultOnPress = () => {};

// Returns a render function compatible with React Native Paper.
const getIconRenderFunction = (iconName: string) => {
	return (props: any) => <Icon name={iconName} {...props} />;
};

const useIcon = (iconName: string) => {
	return useMemo(() => {
		return getIconRenderFunction(iconName);
	}, [iconName]);
};

const ActionButton = (props: ActionButtonProps) => {
	const [open, setOpen] = useState(false);
	const onMenuToggled: FABGroupProps['onStateChange'] = useCallback(state => {
		props.dispatch({
			type: 'SIDE_MENU_CLOSE',
		});
		setOpen(state.open);
	}, [setOpen, props.dispatch]);

	const actions = useMemo(() => (props.buttons ?? []).map(button => {
		return {
			...button,
			icon: getIconRenderFunction(button.icon),
			onPress: button.onPress ?? defaultOnPress,
		};
	}), [props.buttons]);

	const closedIcon = useIcon(props.mainButton?.icon ?? 'add');
	const openIcon = useIcon('close');

	return (
		<Portal>
			<FAB.Group
				open={open}
				accessibilityLabel={props.mainButton?.label ?? _('Add new')}
				icon={ open ? openIcon : closedIcon }
				fabStyle={{
					backgroundColor: props.mainButton?.color ?? 'rgba(231,76,60,1)',
				}}
				onStateChange={onMenuToggled}
				actions={actions}
				onPress={props.mainButton?.onPress ?? defaultOnPress}
				visible={true}
			/>
		</Portal>
	);
};

export default ActionButton;
