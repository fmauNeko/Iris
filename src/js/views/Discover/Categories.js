import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Header from '../../components/Header';
import Icon from '../../components/Icon';
import Button from '../../components/Button';
import FilterField from '../../components/Fields/FilterField';
import { Grid } from '../../components/Grid';
import Loader from '../../components/Loader';
import * as uiActions from '../../services/ui/actions';
import * as spotifyActions from '../../services/spotify/actions';
import { encodeUri } from '../../util/format';
import { i18n, I18n } from '../../locale';
import { indexToArray, applyFilter } from '../../util/arrays';
import { makeLoadingSelector } from '../../util/selectors';

const Categories = ({
  loading,
  categories: categoriesProp,
  spotifyActions: {
    getCategories,
  },
}) => {
  const {
    setWindowTitle,
    hideContextMenu,
  } = uiActions;
  const [filter, setFilter] = useState('');
  let categories = categoriesProp;

  useEffect(() => {
    // Check for an empty category index, or where we've only got one loaded
    // This would be the case if you've refreshed from within a category and only loaded
    // the single record.
    if (!categories || Object.keys(categories).length <= 1) {
      getCategories();
    }
    setWindowTitle(i18n('discover.categories.title'));
  }, []);

  const refresh = () => {
    hideContextMenu();
    getCategories();
  }

  if (filter && filter !== '') categories = applyFilter('name', filter, categories);

  const options = (
    <>
      <FilterField
        initialValue={filter}
        handleChange={setFilter}
        onSubmit={() => hideContextMenu()}
      />
      <Button
        noHover
        onClick={refresh}
        tracking={{ category: 'DiscoverCategory', action: 'Refresh' }}
      >
        <Icon name="refresh" />
        <I18n path="actions.refresh" />
      </Button>
    </>
  );

  return (
    <div className="view discover-categories-view">
      <Header uiActions={uiActions} options={options}>
        <Icon name="mood" type="material" />
        <I18n path="discover.categories.title" />
      </Header>
      <section className="content-wrapper grid-wrapper">
        {loading ? (
          <Loader body loading />
        ) : (
          <Grid
            className="grid--tiles"
            items={categories}
            getLink={(item) => `/discover/categories/${encodeUri(item.uri)}`}
            sourceIcon={false}
          />
        )}
      </section>
    </div>
  );
}

const mapStateToProps = (state) => {
  const loadingSelector = makeLoadingSelector(['spotify_categories']);

  return {
    loading: loadingSelector(state),
    categories: indexToArray(state.spotify.categories),
  };
};

const mapDispatchToProps = (dispatch) => ({
  uiActions: bindActionCreators(uiActions, dispatch),
  spotifyActions: bindActionCreators(spotifyActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Categories);
