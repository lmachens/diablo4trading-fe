import { Game } from '@diablosnaps/common';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Autocomplete, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
import { matchSorter } from 'match-sorter';
import { GAME_SERVER_TYPE_ICONS } from '../constants';
import { useAssets } from '../providers';

const ServerTypeIcon = styled('img')(() => ({
    width: 22,
    height: 22,
    marginRight: 4,
}));

interface ServerTypeInputProps {
    value: Game.ServerType;
    onChange: (value: Game.ServerType) => void;
    disabled?: boolean;
}

export const ServerTypeInput: React.FC<ServerTypeInputProps> = ({
    value,
    onChange,
    disabled,
}) => {
    const { i18n } = useLingui();
    const { language, translations } = useAssets();

    const options = Object
        .values(Game.ServerType)
        .map((type) => ({
            id: type,
            label: Game.getServerTypeText(type, language, translations),
        }));
    let selected = value === undefined ? null : options.find((x) => x.id === value);
    if (selected === undefined) {
        options.push({
            id: value,
            label: t(i18n)`Unknown: ${value}`,
        });
        selected = options[options.length - 1];
    }

    return (
        <Autocomplete
            value={selected}
            options={options}
            filterOptions={(options, { inputValue }) =>
                inputValue.length >= 1
                    ? matchSorter(options, inputValue, {
                        keys: ['label'],
                    })
                    : options}
            onChange={(_, option) => onChange(option?.id)}
            renderOption={(props, option) => (
                <li {...props}>
                    <ServerTypeIcon
                        src={GAME_SERVER_TYPE_ICONS[option.id]}
                        alt={t(i18n)`${Game.getServerTypeText(option.id, language, translations)}'s icon`}
                    />
                    &nbsp;
                    {option.label}
                </li>
            )}
            renderInput={(params) => (
                <TextField
                    {...params}
                    hiddenLabel
                    InputProps={{
                        ...params.InputProps,
                        startAdornment: <ServerTypeIcon src={GAME_SERVER_TYPE_ICONS[value]} />,
                    }}
                />
            )}
            disableClearable
            disabled={disabled}
        />
    );
};
