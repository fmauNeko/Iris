import React, { useState, useEffect } from 'react';
import { ReactSortable } from 'react-sortablejs';
import Icon from '../Icon';
import Link from '../Link';
import { sortItems, indexToArray } from '../../util/arrays';

const Commands = ({
  commands,
  runCommand,
  onChange,
}) => {
  const [list, setList] = useState([]);

  useEffect(() => {
    setList(sortItems(indexToArray(commands), 'sort_order'));
  }, [commands]);

  useEffect(() => {
    setList(sortItems(indexToArray(commands), 'sort_order'));
  }, []);
  
  const onSort = () => {
    const nextCommands = {};
    if (!list || !list.length) return;

    list.forEach((item, index) => {
      nextCommands[item.id] = {
        ...item,
        sort_order: index,
      };
    });

    onChange(nextCommands);
  };

  return (
    <ReactSortable
      options={{
        handle: '.commands-setup__item__drag-handle',
        animation: 150,
      }}
      className="list commands-setup"
      list={list}
      setList={setList}
      onSort={onSort}
    >
      {
        list.map((command) => (
          <div className="list__item commands-setup__item list__item--no-interaction" key={command.id} data-id={command.id}>
            <div className="commands-setup__item__details">
              <Icon className="commands-setup__item__drag-handle" name="drag_indicator" />
              <div className="commands-setup__item__command-item commands__item commands__item--small">
                <Icon className="commands__item__icon" name={command.icon} />
                <span className={`${command.colour}-background commands__item__background`} />
              </div>
              <div className="commands-setup__item__url commands__item__url">
                {command.name ? command.name : <span className="grey-text">{command.url}</span>}
              </div>
            </div>
            <div className="commands-setup__item__actions">
              <a className="commands-setup__item__run-button action" onClick={() => runCommand(command.id, true)}>
                <Icon name="play_arrow" />
              </a>
              <Link className="commands-setup__item__edit-button action" to={`/modal/edit-command/${command.id}`}>
                <Icon name="edit" />
              </Link>
            </div>
          </div>
        ))
      }
    </ReactSortable>
  );
}

export default Commands;
