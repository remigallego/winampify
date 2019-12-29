import styled from "styled-components";
import React from "react";
import CheckButton from "../Explorer/FilterPopover/CheckButton";
import { FaSquare, FaSignOutAlt, FaTrash, FaCheck } from "react-icons/fa";
import TitleBar from "../Explorer/TitleBar";
import { useDispatch, useSelector } from "react-redux";
import { toggleSettingsMenu } from "../../actions/settings";
import { AppState, APPLY_SNAPSHOT } from "../../reducers";
import { toggleDarkMode as toggleDarkModeAction } from "../../actions/settings";
import { initialStateDesktop } from "../../reducers/desktop";
import { logOut } from "../../actions/auth";

interface Props {}

export default (props: Props) => {
  const isDarkMode = useSelector(
    (state: AppState) => state.settings.isDarkMode
  );
  const dispatch = useDispatch();

  const toggleDarkMode = () => {
    dispatch(toggleDarkModeAction());
  };
  return (
    <BackgroundModal>
      <Container>
        <TitleBar
          title={"Settings"}
          onClose={() => dispatch(toggleSettingsMenu())}
        ></TitleBar>
        <WithPadding>
          <HorizontalContainer onClick={toggleDarkMode}>
            {!isDarkMode && (
              <FaSquare
                color={isDarkMode ? "white" : "black"}
                style={{ paddingRight: 5 }}
              />
            )}
            {isDarkMode && (
              <FaCheck
                color={isDarkMode ? "white" : "black"}
                style={{ paddingRight: 5 }}
              />
            )}
            <Text>Enable Dark Mode</Text>
          </HorizontalContainer>
          <HorizontalContainer onClick={() => dispatch(logOut())}>
            <FaSignOutAlt
              color={isDarkMode ? "white" : "black"}
              style={{ paddingRight: 5 }}
            />
            <Text>Logout</Text>
          </HorizontalContainer>
          <div style={{ color: "grey", paddingTop: 15, opacity: 0.8 }}>
            Work In Progress: More to come. ;)
          </div>
        </WithPadding>
      </Container>
    </BackgroundModal>
  );
};

const BackgroundModal = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 999;
`;

const Container = styled.div`
  transition: background-color 0.3s;
  background-color: ${props => props.theme.explorer.bg};
  color: ${props => props.theme.explorer.file.text};
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  opacity: 1;
  /* LOL: */
  z-index: infinite;
  border-radius: 2px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.4), 0 6px 20px 0 rgba(0, 0, 0, 0.3);
`;

const WithPadding = styled.div`
  padding: 10px 100px 30px 50px;
`;

const HorizontalContainer = styled.div`
  flex-direction: row;
  display: flex;
  align-items: center;
  padding-top: 10px;
  cursor: pointer;
`;

const Text = styled.div`
  font-weight: 500;
`;

const TextBold = styled(Text)`
  font-weight: 600;
  font-size: 18px;
`;
