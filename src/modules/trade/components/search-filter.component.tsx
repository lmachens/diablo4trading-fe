import { Game } from '@diablosnaps/common';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import RestoreIcon from '@mui/icons-material/Restore';
import SearchIcon from '@mui/icons-material/Search';
import { Box, Button, Card, Collapse, Grid } from '@mui/material';
import { API } from '@sanctuaryteam/shared';
import React from 'react';
import { useServerType } from '../providers';
import { SearchFilterAffix } from './search-filter-affix.component';
import { SearchFilterItem } from './search-filter-item.component';
import { SearchFilterSeasonal } from './search-filter-seasonal.component';

interface SearchFilterProps {
    payload: API.SearchPayload;
    onSearch: (payload: API.SearchPayload) => void;
    searching?: boolean;
}

export const SearchFilter: React.FC<SearchFilterProps> = ({
    payload: initialPayload,
    onSearch,
    searching,
}) => {
    const { i18n } = useLingui();

    const [serverType] = useServerType();

    const [visible, setVisible] = React.useState<boolean>(true);
    const [payload, setPayload] = React.useState<API.SearchPayload>(initialPayload);

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        onSearch(payload);
        setVisible(false);
    };

    const handleClear = () => {
        setPayload({});
    };

    const {
        query = {},
    } = payload;

    return (
        <form onSubmit={handleSubmit}>
            <Card sx={{ p: 2, pt: 0 }}>
                <Collapse in={visible}>
                    <Box pt={2}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <Grid container item spacing={2}>
                                    <Grid item xs={12}>
                                        <SearchFilterItem
                                            value={query.item}
                                            onChange={item => setPayload({ ...payload, query: { ...query, item } })}
                                        />
                                    </Grid>
                                    {(
                                        serverType === Game.ServerType.Seasonal ||
                                        serverType === Game.ServerType.SeasonalHardcore
                                    ) && (
                                            <Grid item xs={12}>
                                                <SearchFilterSeasonal
                                                    value={query.seasonal}
                                                    onChange={seasonal => setPayload({ ...payload, query: { ...query, seasonal } })}
                                                />
                                            </Grid>
                                        )
                                    }
                                </Grid>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <SearchFilterAffix
                                    value={query.affix}
                                    onChange={affix => setPayload({ ...payload, query: { ...query, affix } })}
                                />
                            </Grid>
                        </Grid>
                    </Box>
                </Collapse>
                <Box pt={2}>
                    <Grid container spacing={1}>
                        <Grid item sx={{ xs: 'hidden' }} sm={4} />
                        <Grid item xs={12} md={4}>
                            <Button
                                variant='outlined'
                                fullWidth
                                onClick={handleSubmit}
                                startIcon={!searching ? <SearchIcon /> : undefined}
                                disabled={searching}
                            >
                                {!searching
                                    ? t(i18n)`Search`
                                    : t(i18n)`Searching...`}
                            </Button>
                        </Grid>
                        <Grid
                            item xs={12} md={4}
                            display='flex'
                            justifyContent='flex-end'
                            sx={theme => ({
                                [theme.breakpoints.down('sm')]: {
                                    justifyContent: 'space-between',
                                },
                            })}
                            gap={1}
                        >
                            <Button
                                variant='outlined'
                                onClick={handleClear}
                                startIcon={<RestoreIcon />}
                                disabled={searching}
                            >
                                {t(i18n)`Clear`}
                            </Button>
                            <Button
                                variant='outlined'
                                color='secondary'
                                onClick={() => setVisible(!visible)}
                                endIcon={visible ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                            >
                                {visible
                                    ? t(i18n)`Hide Filters`
                                    : t(i18n)`Show Filters`
                                }
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Card>
        </form>
    )
}