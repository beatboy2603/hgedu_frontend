import React from 'react';
import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <Typography
            component="div"
            role="tabpanel"
            hidden={value !== index}
            id={`full-width-tabpanel-${index}`}
            aria-labelledby={`full-width-tab-${index}`}
            {...other}

        >
            {value === index && <Box style={{ padding: "0" }} p={3}>{children}</Box>}
        </Typography>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

function a11yProps(index) {
    return {
        id: `full-width-tab-${index}`,
        'aria-controls': `full-width-tabpanel-${index}`,
    };
}

const useStyles = makeStyles(theme => ({
    root: {
        backgroundColor: theme.palette.background.paper,
        minWidth: 500,
    },
}));

export default function FullWidthTabs({ addFormula, addToFormula }) {
    const classes = useStyles();
    const theme = useTheme();
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleChangeIndex = index => {
        setValue(index);
    };

    return (
        <div className={classes.root}>
            <AppBar position="static" color="default" style={{ boxShadow: "none", borderRadius: "10px 10px 0 0" }}>
                <Tabs
                    value={value}
                    onChange={handleChange}
                    // TabIndicatorProps={{style: {background:'#eef6ff'}}}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="fullWidth"
                    aria-label="full width tabs example"
                >
                    <Tab style={{ minWidth: "16%", width: "16%", border: "1px solid #e0e5eb", borderTopLeftRadius: "10px", backgroundColor: "#eef6ff" }} label={<img height="25px" src={require("../../resources/fx/1/Label.svg")} />} {...a11yProps(0)} />
                    {/* <Tab style={{ minWidth: "16%", width: "16%", border: "1px solid #e0e5eb", borderTopLeftRadius: "10px" }} icon={<InlineMath math="\\sqrt{a}\\frac{a}{b}" />} /> */}
                    <Tab style={{ minWidth: "16%", width: "16%", border: "1px solid #e0e5eb", backgroundColor: "#eef6ff" }} label={<img height="25px" src={require("../../resources/fx/2/Label.svg")} />} {...a11yProps(1)} />
                    <Tab style={{ minWidth: "16%", width: "16%", border: "1px solid #e0e5eb", backgroundColor: "#eef6ff" }} label={<img height="25px" src={require("../../resources/fx/3/Label.svg")} />} {...a11yProps(2)} />
                    <Tab style={{ minWidth: "16%", width: "16%", border: "1px solid #e0e5eb", backgroundColor: "#eef6ff" }} label={<img height="25px" src={require("../../resources/fx/4/Label.svg")} />} {...a11yProps(3)} />
                    <Tab style={{ minWidth: "16%", width: "16%", border: "1px solid #e0e5eb", backgroundColor: "#eef6ff" }} label={<img height="25px" src={require("../../resources/fx/5/Label.svg")} />} {...a11yProps(4)} />
                    <Tab style={{ minWidth: "16%", width: "16%", border: "1px solid #e0e5eb", borderTopRightRadius: "10px", backgroundColor: "#eef6ff" }} label={<img height="25px" src={require("../../resources/fx/6/Label.svg")} />} {...a11yProps(5)} />
                </Tabs>
            </AppBar>
            <SwipeableViews
                axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                index={value}
                onChangeIndex={handleChangeIndex}
                style={{ border: "1px solid #e0e5eb", backgroundColor: "#eef6ff" }}
            >
                <TabPanel value={value} index={0} dir={theme.direction} style={{ backgroundColor: "#eef6ff" }}>

                    <div className="row" style={{ margin: "0" }}>
                        {/* <div className="col s1"> */}
                        <table className={"tableCenterTd"}>
                            <tr>
                                <td><img onClick={() => { addToFormula("\\sqrt{ }") }} src={require("../../resources/fx/1/1sqrt.svg")} style={{ cursor: "pointer" }} alt="sqrt" /></td>
                                <td className="row">
                                    <div className="col s4"><img onClick={() => { addToFormula("{ }^{ }") }} src={require("../../resources/fx/1/3^.svg")} style={{ cursor: "pointer" }} alt="^" /></div>
                                    <div className="col s4"><img onClick={() => { addToFormula("{ }_{ }") }} src={require("../../resources/fx/1/4_.svg")} style={{ cursor: "pointer" }} alt="_" /></div>
                                    <div className="col s4"><img onClick={() => { addToFormula("^{ }_{ }") }} src={require("../../resources/fx/1/5^_.svg")} style={{ cursor: "pointer" }} alt="^_" /></div>
                                </td>
                                <td><img onClick={() => { addToFormula("\\frac{ }{ }") }} src={require("../../resources/fx/1/9a-b.svg")} style={{ cursor: "pointer" }} alt="a-b" /></td>
                                <td className="row">
                                    <div className="col s4"><img onClick={() => { addToFormula("\\lim\\limits_{ }") }} src={require("../../resources/fx/1/11lim.svg")} style={{ cursor: "pointer" }} alt="lim" /></div>
                                    <div className="col s4"><img onClick={() => { addToFormula("\\displaystyle\\sum_{ }^{ }") }} src={require("../../resources/fx/1/13∑^_.svg")} style={{ cursor: "pointer" }} alt="∑^_" /></div>
                                    <div className="col s4"><img onClick={() => { addToFormula("| |") }} src={require("../../resources/fx/1/15abs.svg")} style={{ cursor: "pointer" }} alt="abs" /></div>
                                </td>
                                <td className="row">
                                    <div className="col s4"><img onClick={() => { addToFormula("\\int") }} src={require("../../resources/fx/1/16∫.svg")} style={{ cursor: "pointer" }} alt="∫" /></div>
                                    <div className="col s4"><img onClick={() => { addToFormula("\\iint") }} src={require("../../resources/fx/1/18∫∫.svg")} style={{ cursor: "pointer" }} alt="∫∫" /></div>

                                </td>
                            </tr>
                            <tr>
                                <td><img onClick={() => { addToFormula("\\sqrt[ ]{ }") }} src={require("../../resources/fx/1/2nth-root.svg")} style={{ cursor: "pointer" }} alt="nth-root" /></td>
                                <td className="row">
                                    <div className="col s4"><img onClick={() => { addToFormula("\\overset{ }{ }") }} src={require("../../resources/fx/1/6^-.svg")} style={{ cursor: "pointer" }} alt="^-" /></div>
                                    <div className="col s4"><img onClick={() => { addToFormula("\\underset{ }{ }") }} src={require("../../resources/fx/1/7_-.svg")} style={{ cursor: "pointer" }} alt="_-" /></div>
                                </td>
                                <td><img onClick={() => { addToFormula("\\int_{ }^{ }") }} src={require("../../resources/fx/1/10∫.svg")} style={{ cursor: "pointer" }} alt="∫" /></td>
                                <td className="row">
                                    <div className="col s4"><img onClick={() => { addToFormula("\\log_{ }") }} src={require("../../resources/fx/1/12log.svg")} style={{ cursor: "pointer" }} alt="log" /></div>
                                    <div className="col s4"><img onClick={() => { addToFormula("\\displaystyle\\sum_{ }") }} src={require("../../resources/fx/1/14∑_.svg")} style={{ cursor: "pointer" }} alt="∑_" /></div>
                                </td>
                                <td className="row">
                                    <div className="col s4"><img onClick={() => { addToFormula("\\oint") }} src={require("../../resources/fx/1/17∫ o.svg")} style={{ cursor: "pointer" }} alt="∫ o" /></div>
                                    <div className="col s4"><img onClick={() => { addToFormula("\\iiint") }} src={require("../../resources/fx/1/20∫∫∫.svg")} style={{ cursor: "pointer" }} alt="∫∫∫" /></div>
                                </td>
                            </tr>
                        </table>
                    </div>
                </TabPanel>
                <TabPanel value={value} index={1} dir={theme.direction} style={{ backgroundColor: "#eef6ff" }}>
                    <div className="row" style={{ margin: "0" }}>
                        <table className={"tableCenterTd"}>
                            <tr>
                                <td className="row">
                                    <div className="col s6"><img onClick={() => { addToFormula("\\begin{vmatrix}{ }&{ }\\\\{ }&{ }\\end{vmatrix}") }} src={require("../../resources/fx/2/1.svg")} style={{ cursor: "pointer" }} alt="||" /></div>
                                    <div className="col s6"><img onClick={() => { addToFormula("\\begin{bmatrix}{ }&{ }\\\\{ }&{ }\\end{bmatrix}") }} src={require("../../resources/fx/2/3[].svg")} style={{ cursor: "pointer" }} alt="[]" /></div>
                                </td>
                                <td><img onClick={() => { addToFormula("{}=\\begin{cases}{}&\\text{if }{}\\\\{}&\\text{if }{ }\\end{cases}") }} src={require("../../resources/fx/2/5{.svg")} style={{ cursor: "pointer" }} alt="{" /></td>
                            </tr>
                            <tr>
                                <td className="row">
                                    <div className="col s6"><img onClick={() => { addToFormula("\\begin{pmatrix}{ }&{ }\\\\{ }&{}\\end{pmatrix}") }} src={require("../../resources/fx/2/2().svg")} style={{ cursor: "pointer" }} alt="()" /></div>
                                    <div className="col s6"><img onClick={() => { addToFormula("\\begin{Bmatrix}{ }&{ }\\\\{ }&{ }\\end{Bmatrix}") }} src={require("../../resources/fx/2/4{}.svg")} style={{ cursor: "pointer" }} alt="{}" /></div>
                                </td>
                            </tr>
                        </table>
                    </div>
                </TabPanel>
                <TabPanel value={value} index={2} dir={theme.direction} style={{ backgroundColor: "#eef6ff" }}>
                    <div className="row" style={{ margin: "0" }}>
                        <table className={"tableCenterTd"}>
                            <tr>
                                <td className="row">
                                    <div className="col s3"><img onClick={() => { addToFormula("=") }} src={require("../../resources/fx/3/1=.svg")} style={{ cursor: "pointer" }} alt="=" /></div>
                                    <div className="col s3"><img onClick={() => { addToFormula("\\xlongequal{ }") }} src={require("../../resources/fx/3/3Long =.svg")} style={{ cursor: "pointer" }} alt="Long =" /></div>
                                    <div className="col s3"><img onClick={() => { addToFormula("\\equiv") }} src={require("../../resources/fx/3/5≡.svg")} style={{ cursor: "pointer" }} alt="≡" /></div>
                                    <div className="col s3"><img onClick={() => { addToFormula("\\le") }} src={require("../../resources/fx/3/7≤.svg")} style={{ cursor: "pointer" }} alt="≤" /></div>
                                </td>
                                <td className="row">
                                    <div className="col s2"><img onClick={() => { addToFormula("\\in") }} src={require("../../resources/fx/3/9ϵ.svg")} style={{ cursor: "pointer" }} alt="ϵ" /></div>
                                    <div className="col s2"><img onClick={() => { addToFormula("\\ni") }} src={require("../../resources/fx/3/11϶.svg")} style={{ cursor: "pointer" }} alt="϶" /></div>
                                    <div className="col s2"><img onClick={() => { addToFormula("\\exists") }} src={require("../../resources/fx/3/13ꓱ.svg")} style={{ cursor: "pointer" }} alt="ꓱ" /></div>
                                    <div className="col s2"><img onClick={() => { addToFormula("\\bigcap") }} src={require("../../resources/fx/3/15ᴜ down.svg")} style={{ cursor: "pointer" }} alt="ᴜ down" /></div>
                                    <div className="col s2"><img onClick={() => { addToFormula("\\subset") }} src={require("../../resources/fx/3/17ᴜ left.svg")} style={{ cursor: "pointer" }} alt="ᴜ left" /></div>
                                    <div className="col s2"><img onClick={() => { addToFormula("\\varnothing") }} src={require("../../resources/fx/3/19Ø.svg")} style={{ cursor: "pointer" }} alt="Ø" /></div>
                                </td>
                            </tr>
                            <tr>
                                <td className="row">
                                    <div className="col s3"><img onClick={() => { addToFormula("\\approx") }} src={require("../../resources/fx/3/2≈.svg")} style={{ cursor: "pointer" }} alt="≈" /></div>
                                    <div className="col s3"><img onClick={() => { addToFormula("\\not =") }} src={require("../../resources/fx/3/4≠.svg")} style={{ cursor: "pointer" }} alt="≠" /></div>
                                    <div className="col s3"><img onClick={() => { addToFormula("\\ge") }} src={require("../../resources/fx/3/6≥.svg")} style={{ cursor: "pointer" }} alt="≥" /></div>
                                    <div className="col s3"><img onClick={() => { addToFormula("\\pm") }} src={require("../../resources/fx/3/8±.svg")} style={{ cursor: "pointer" }} alt="±" /></div>
                                </td>
                                <td className="row">
                                    <div className="col s2"><img onClick={() => { addToFormula("\\notin") }} src={require("../../resources/fx/3/10ϵ no.svg")} style={{ cursor: "pointer" }} alt="ϵ no" /></div>
                                    <div className="col s2"><img onClick={() => { addToFormula("\\notni") }} src={require("../../resources/fx/3/12϶ no.svg")} style={{ cursor: "pointer" }} alt="϶ no" /></div>
                                    <div className="col s2"><img onClick={() => { addToFormula("\\nexists") }} src={require("../../resources/fx/3/14ꓱ no.svg")} style={{ cursor: "pointer" }} alt="ꓱ no" /></div>
                                    <div className="col s2"><img onClick={() => { addToFormula("\\bigcup") }} src={require("../../resources/fx/3/16ᴜ up.svg")} style={{ cursor: "pointer" }} alt="ᴜ up" /></div>
                                    <div className="col s2"><img onClick={() => { addToFormula("\\supset") }} src={require("../../resources/fx/3/18u right.svg")} style={{ cursor: "pointer" }} alt="ᴜ right" /></div>
                                </td>
                            </tr>
                        </table>
                    </div>
                </TabPanel>
                <TabPanel value={value} index={3} dir={theme.direction} style={{ backgroundColor: "#eef6ff" }}>
                    <div className="row" style={{ margin: "0" }}>
                        <table className={"tableCenterTd"}>
                            <tr>
                                <td className="row">
                                    <div className="col s3"><img onClick={() => { addToFormula("\\uparrow") }} src={require("../../resources/fx/4/3↑.svg")} style={{ cursor: "pointer" }} alt="↑" /></div>
                                    <div className="col s3"><img onClick={() => { addToFormula("\\downarrow") }} src={require("../../resources/fx/4/4↓.svg")} style={{ cursor: "pointer" }} alt="↓" /></div>
                                    <div className="col s3"><img onClick={() => { addToFormula("\\leftarrow") }} src={require("../../resources/fx/4/2←.svg")} style={{ cursor: "pointer" }} alt="←" /></div>
                                    <div className="col s3"><img onClick={() => { addToFormula("\\rightarrow") }} src={require("../../resources/fx/4/1→.svg")} style={{ cursor: "pointer" }} alt="→" /></div>
                                </td>
                                <td><img onClick={() => { addToFormula("\\leftrightarrow") }} src={require("../../resources/fx/4/9↔.svg")} style={{ cursor: "pointer" }} alt="↔" /></td>
                                <td className="row">
                                    <div className="col s3"><img onClick={() => { addToFormula("\\xrightarrow{ }") }} src={require("../../resources/fx/4/11→ con.svg")} style={{ cursor: "pointer" }} alt="→ con" /></div>
                                    <div className="col s3"><img onClick={() => { addToFormula("\\xleftarrow{ }") }} src={require("../../resources/fx/4/12← con.svg")} style={{ cursor: "pointer" }} alt="← con" /></div>
                                    <div className="col s3"><img onClick={() => { addToFormula("\\xleftrightarrow{ }") }} src={require("../../resources/fx/4/17- con.svg")} style={{ cursor: "pointer" }} alt="- con" /></div>
                                    <div className="col s3"><img onClick={() => { addToFormula("\\xleftrightharpoons{ }") }} src={require("../../resources/fx/4/15→← con.svg")} style={{ cursor: "pointer" }} alt="→← con" /></div>
                                </td>
                            </tr>
                            <tr>
                                <td className="row">
                                    <div className="col s3"><img onClick={() => { addToFormula("\\Uparrow") }} src={require("../../resources/fx/4/7⇒ up.svg")} style={{ cursor: "pointer" }} alt="⇒ up" /></div>
                                    <div className="col s3"><img onClick={() => { addToFormula("\\Downarrow") }} src={require("../../resources/fx/4/8⇒ down.svg")} style={{ cursor: "pointer" }} alt="⇒ down" /></div>
                                    <div className="col s3"><img onClick={() => { addToFormula("\\Leftarrow") }} src={require("../../resources/fx/4/6⇒ left.svg")} style={{ cursor: "pointer" }} alt="⇒ left" /></div>
                                    <div className="col s3"><img onClick={() => { addToFormula("\\Rightarrow") }} src={require("../../resources/fx/4/5⇒.svg")} style={{ cursor: "pointer" }} alt="⇒" /></div>
                                </td>
                                <td><img onClick={() => { addToFormula("\\Leftrightarrow") }} src={require("../../resources/fx/4/10=.svg")} style={{ cursor: "pointer" }} alt="=" /></td>
                                <td className="row">
                                    <div className="col s3"><img onClick={() => { addToFormula("\\xRightarrow{ }") }} src={require("../../resources/fx/4/13⇒ con.svg")} style={{ cursor: "pointer" }} alt="⇒ con" /></div>
                                    <div className="col s3"><img onClick={() => { addToFormula("\\xLeftarrow{ }") }} src={require("../../resources/fx/4/14⇒ left con.svg")} style={{ cursor: "pointer" }} alt="⇒ left con" /></div>
                                    <div className="col s3"><img onClick={() => { addToFormula("\\xLeftrightarrow{ }") }} src={require("../../resources/fx/4/16= con.svg")} style={{ cursor: "pointer" }} alt="= con" /></div>
                                </td>
                            </tr>
                        </table>
                    </div>
                </TabPanel>
                <TabPanel value={value} index={4} dir={theme.direction} style={{ backgroundColor: "#eef6ff" }}>
                    <div className="row" style={{ margin: "0" }}>
                        <table className={"tableCenterTd"}>
                            <tr>
                                <td className="row">
                                    <div className="col s3"><img onClick={() => { addToFormula("\\forall") }} src={require("../../resources/fx/5/1∀.svg")} style={{ cursor: "pointer" }} alt="∀" /></div>
                                    <div className="col s3"><img onClick={() => { addToFormula("\\infty") }} src={require("../../resources/fx/5/2∞.svg")} style={{ cursor: "pointer" }} alt="∞" /></div>
                                    <div className="col s3"><img onClick={() => { addToFormula("\\nabla") }} src={require("../../resources/fx/5/4Δ.svg")} style={{ cursor: "pointer" }} alt="Δ" /></div>
                                    <div className="col s3"><img onClick={() => { addToFormula("\\varphi") }} src={require("../../resources/fx/5/φ-1.svg")} style={{ cursor: "pointer" }} alt="φ-1" /></div>
                                </td>
                                <td className="row">
                                    <div className="col s1"><img onClick={() => { addToFormula("\\alpha") }} src={require("../../resources/fx/5/α-1.svg")} style={{ cursor: "pointer" }} alt="α-1" /></div>
                                    <div className="col s1"><img onClick={() => { addToFormula("\\beta") }} src={require("../../resources/fx/5/β-1.svg")} style={{ cursor: "pointer" }} alt="β-1" /></div>
                                    <div className="col s1"><img onClick={() => { addToFormula("\\gamma") }} src={require("../../resources/fx/5/γ-1.svg")} style={{ cursor: "pointer" }} alt="γ-1" /></div>
                                    <div className="col s1"><img onClick={() => { addToFormula("\\delta") }} src={require("../../resources/fx/5/δ-1.svg")} style={{ cursor: "pointer" }} alt="δ-1" /></div>
                                    <div className="col s1"><img onClick={() => { addToFormula("\\varepsilon") }} src={require("../../resources/fx/5/ε-1.svg")} style={{ cursor: "pointer" }} alt="ε-1" /></div>
                                    <div className="col s1"><img onClick={() => { addToFormula("\\lambda") }} src={require("../../resources/fx/5/λ-1.svg")} style={{ cursor: "pointer" }} alt="λ-1" /></div>
                                    <div className="col s1"><img onClick={() => { addToFormula("\\mu") }} src={require("../../resources/fx/5/μ-1.svg")} style={{ cursor: "pointer" }} alt="μ-1" /></div>
                                    <div className="col s1"><img onClick={() => { addToFormula("\\xi") }} src={require("../../resources/fx/5/ξ-1.svg")} style={{ cursor: "pointer" }} alt="ξ-1" /></div>
                                    <div className="col s1"><img onClick={() => { addToFormula("\\pi") }} src={require("../../resources/fx/5/π-1.svg")} style={{ cursor: "pointer" }} alt="π-1" /></div>
                                    <div className="col s1"><img onClick={() => { addToFormula("\\sigma") }} src={require("../../resources/fx/5/ϭ.svg")} style={{ cursor: "pointer" }} alt="ϭ" /></div>
                                    <div className="col s1"><img onClick={() => { addToFormula("\\phi") }} src={require("../../resources/fx/5/ϕ.svg")} style={{ cursor: "pointer" }} alt="ϕ" /></div>
                                    <div className="col s1"><img onClick={() => { addToFormula("\\chi") }} src={require("../../resources/fx/5/χ-1.svg")} style={{ cursor: "pointer" }} alt="χ-1" /></div>
                                </td>
                            </tr>
                            <tr>
                                <td className="row">
                                    <div className="col s3"><img onClick={() => { addToFormula("\\psi") }} src={require("../../resources/fx/5/ψ-1.svg")} style={{ cursor: "pointer" }} alt="ψ-1" /></div>
                                    <div className="col s3"><img onClick={() => { addToFormula("\\Psi") }} src={require("../../resources/fx/5/Ψ.svg")} style={{ cursor: "pointer" }} alt="Ψ" /></div>
                                    <div className="col s3"><img onClick={() => { addToFormula("\\omega") }} src={require("../../resources/fx/5/ω-1.svg")} style={{ cursor: "pointer" }} alt="ω-1" /></div>
                                    <div className="col s3"><img onClick={() => { addToFormula("\\Omega") }} src={require("../../resources/fx/5/Ω.svg")} style={{ cursor: "pointer" }} alt="Ω" /></div>
                                </td>
                                <td className="row">
                                    <div className="col s1"><img onClick={() => { addToFormula("\\Alpha") }} src={require("../../resources/fx/5/Α.svg")} style={{ cursor: "pointer" }} alt="Α" /></div>
                                    <div className="col s1"><img onClick={() => { addToFormula("\\Beta") }} src={require("../../resources/fx/5/Β.svg")} style={{ cursor: "pointer" }} alt="Β" /></div>
                                    <div className="col s1"><img onClick={() => { addToFormula("\\Gamma") }} src={require("../../resources/fx/5/Γ.svg")} style={{ cursor: "pointer" }} alt="Γ" /></div>
                                    <div className="col s1"><img onClick={() => { addToFormula("\\Delta") }} src={require("../../resources/fx/5/Δ.svg")} style={{ cursor: "pointer" }} alt="Δ" /></div>
                                    <div className="col s1"><img onClick={() => { addToFormula("\\Epsilon") }} src={require("../../resources/fx/5/Ε.svg")} style={{ cursor: "pointer" }} alt="Ε" /></div>
                                    <div className="col s1"><img onClick={() => { addToFormula("\\Lambda") }} src={require("../../resources/fx/5/Λ.svg")} style={{ cursor: "pointer" }} alt="Λ" /></div>
                                    <div className="col s1"><img onClick={() => { addToFormula("\\Mu") }} src={require("../../resources/fx/5/Μ.svg")} style={{ cursor: "pointer" }} alt="Μ" /></div>
                                    <div className="col s1"><img onClick={() => { addToFormula("\\Xi") }} src={require("../../resources/fx/5/Ξ.svg")} style={{ cursor: "pointer" }} alt="Ξ" /></div>
                                    <div className="col s1"><img onClick={() => { addToFormula("\\Pi") }} src={require("../../resources/fx/5/Π.svg")} style={{ cursor: "pointer" }} alt="Π" /></div>
                                    <div className="col s1"><img onClick={() => { addToFormula("\\Sigma") }} src={require("../../resources/fx/5/Σ.svg")} style={{ cursor: "pointer" }} alt="Σ" /></div>
                                    <div className="col s1"><img onClick={() => { addToFormula("\\Phi") }} src={require("../../resources/fx/5/Φ.svg")} style={{ cursor: "pointer" }} alt="Φ" /></div>
                                    <div className="col s1"><img onClick={() => { addToFormula("\\Chi") }} src={require("../../resources/fx/5/Χ.svg")} style={{ cursor: "pointer" }} alt="Χ" /></div>
                                </td>
                            </tr>
                        </table>
                    </div>
                </TabPanel>
                <TabPanel value={value} index={5} dir={theme.direction} style={{ backgroundColor: "#eef6ff" }}>
                    <div className="row" style={{ margin: "0" }}>
                        <table className={"tableCenterTd"}>
                            <tr>
                                <td className="row">
                                    <div className="col s3"><img onClick={() => { addToFormula("\\overgroup{ }") }} src={require("../../resources/fx/6/1⁀.svg")} style={{ cursor: "pointer" }} alt="⁀" /></div>
                                    <div className="col s3"><img onClick={() => { addToFormula("\\overline{ }") }} src={require("../../resources/fx/6/3⸺.svg")} style={{ cursor: "pointer" }} alt="⸺" /></div>
                                    <div className="col s3"><img onClick={() => { addToFormula("\\overrightarrow{ }") }} src={require("../../resources/fx/6/5→.svg")} style={{ cursor: "pointer" }} alt="→" /></div>
                                    <div className="col s3"><img onClick={() => { addToFormula("\\hat{ }") }} src={require("../../resources/fx/6/7^.svg")} style={{ cursor: "pointer" }} alt="^" /></div>
                                </td>
                                <td className="row">
                                    <div className="col s6"><img onClick={() => { addToFormula("\\sout{ }") }} src={require("../../resources/fx/6/9---.svg")} style={{ cursor: "pointer" }} alt="---" /></div>
                                    <div className="col s6"><img onClick={() => { addToFormula("\\overbrace{ }^{ }") }} src={require("../../resources/fx/6/11{ up.svg")} style={{ cursor: "pointer" }} alt="{ up" /></div>
                                </td>
                            </tr>
                            <tr>
                                <td className="row">
                                    <div className="col s3"><img onClick={() => { addToFormula("\\undergroup{ }") }} src={require("../../resources/fx/6/2⁀ down.svg")} style={{ cursor: "pointer" }} alt="⁀ down" /></div>
                                    <div className="col s3"><img onClick={() => { addToFormula("\\underline{ }") }} src={require("../../resources/fx/6/4⸺ down.svg")} style={{ cursor: "pointer" }} alt="⸺ down" /></div>
                                    <div className="col s3"><img onClick={() => { addToFormula("\\overleftarrow{ }") }} src={require("../../resources/fx/6/6→ rev.svg")} style={{ cursor: "pointer" }} alt="→ rev" /></div>
                                    <div className="col s3"><img onClick={() => { addToFormula("\\mathring{ }") }} src={require("../../resources/fx/6/8○.svg")} style={{ cursor: "pointer" }} alt="○" /></div>
                                </td>
                                <td className="row">
                                    <div className="col s6"><img onClick={() => { addToFormula("\\xcancel{ }") }} src={require("../../resources/fx/6/10x.svg")} style={{ cursor: "pointer" }} alt="x" /></div>
                                    <div className="col s6"><img onClick={() => { addToFormula("\\underbrace{ }_{ }") }} src={require("../../resources/fx/6/12{ down.svg")} style={{ cursor: "pointer" }} alt="{ down" /></div>
                                </td>
                            </tr>
                        </table>
                    </div>
                </TabPanel>
            </SwipeableViews>
        </div>
    );
}