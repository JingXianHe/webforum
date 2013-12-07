/* Thursday 5th of December 2013 09:14:20 PM*/

//Javasript name: My Date Time Picker
//Date created: 16-Nov-2003 23:19
//Creator: TengYong Ng
//Website: http://www.rainforestnet.com
//Copyright (c) 2003 TengYong Ng
//FileName: DateTimePicker_css.js
//Version: 2.2.4
// Note: Permission given to use and modify this script in ANY kind of applications if
//       header lines are left unchanged.
//Permission is granted to redistribute and modify this javascript under a FreeBSD License.
//New Css style version added by Yvan Lavoie (Québec, Canada) 29-Jan-2009
//Formatted for JSLint compatibility by Labsmedia.com (30-Dec-2010)


//Global variables

var winCal;
var dtToday;
var Cal;
var MonthName;
var WeekDayName1;
var WeekDayName2;
var exDateTime;//Existing Date and Time
var selDate;//selected date. version 1.7
var calSpanID = "calBorder"; // span ID
var domStyle = null; // span DOM object with style
var cnLeft = "0";//left coordinate of calendar span
var cnTop = "0";//top coordinate of calendar span
var xpos = 0; // mouse x position
var ypos = 0; // mouse y position
var calHeight = 0; // calendar height
var CalWidth = 208;// calendar width
var CellWidth = 30;// width of day cell.
var TimeMode = 24;// TimeMode value. 12 or 24
var StartYear = 2013; //First Year in drop down year selection
var EndYear = 5; // The last year of pickable date. if current year is 2011, the last year that still picker will be 2016 (2011+5)
var CalPosOffsetX = -1; //X position offset relative to calendar icon, can be negative value
var CalPosOffsetY = 0; //Y position offset relative to calendar icon, can be negative value

//Configurable parameters start
var SpanBorderColor = "#000000";//span border color
var SpanBgColor = "#FFFFFF"; //span background color
var MonthYearColor = "#cc0033"; //Font Color of Month and Year in Calendar header.
var WeekHeadColor = "#18861B"; //var WeekHeadColor="#18861B";//Background Color in Week header.
var SundayColor = "#C0F64F"; //var SundayColor="#C0F64F";//Background color of Sunday.
var SaturdayColor = "#C0F64F"; //Background color of Saturday.
var WeekDayColor = "#FFEDA6"; //Background color of weekdays.
var FontColor = "blue"; //color of font in Calendar day cell.
var TodayColor = "#ffbd35"; //var TodayColor="#FFFF33";//Background color of today.
var SelDateColor = "#8DD53C"; //var SelDateColor = "#8DD53C";//Backgrond color of selected date in textbox.
var YrSelColor = "#cc0033"; //color of font of Year selector.
var MthSelColor = "#cc0033"; //color of font of Month selector if "MonthSelector" is "arrow".
var HoverColor = "#E0FF38"; //color when mouse move over.
var DisableColor = "#999966"; //color of disabled cell.
var CalBgColor = "#ffffff"; //Background color of Calendar window.

var WeekChar = 2;//number of character for week day. if 2 then Mo,Tu,We. if 3 then Mon,Tue,Wed.
var DateSeparator = "-";//Date Separator, you can change it to "-" if you want.
var ShowLongMonth = true;//Show long month name in Calendar header. example: "January".
var ShowMonthYear = true;//Show Month and Year in Calendar header.
var ThemeBg = "";//Background image of Calendar window.
var PrecedeZero = true;//Preceding zero [true|false]
var MondayFirstDay = true;//true:Use Monday as first day; false:Sunday as first day. [true|false]  //added in version 1.7
var UseImageFiles = false;//Use image files with "arrows" and "close" button
var imageFilesPath = "images2/";
//Configurable parameters end

//use the Month and Weekday in your preferred language.
var MonthName = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var WeekDayName1 = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
var WeekDayName2 = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];


//end Configurable parameters

//end Global variable


// Calendar prototype
function Calendar(pDate, pCtrl)
{
	//Properties
	this.Date = pDate.getDate();//selected date
	this.Month = pDate.getMonth();//selected month number
	this.Year = pDate.getFullYear();//selected year in 4 digits
	this.Hours = pDate.getHours();

	if (pDate.getMinutes() < 10)
	{
		this.Minutes = "0" + pDate.getMinutes();
	}
	else
	{
		this.Minutes = pDate.getMinutes();
	}

	if (pDate.getSeconds() < 10)
	{
		this.Seconds = "0" + pDate.getSeconds();
	}
	else
	{
		this.Seconds = pDate.getSeconds();
	}
	this.MyWindow = winCal;
	this.Ctrl = pCtrl;
	this.Format = "ddMMyyyy";
	this.Separator = DateSeparator;
	this.ShowTime = false;
	this.Scroller = "DROPDOWN";
	if (pDate.getHours() < 12)
	{
		this.AMorPM = "AM";
	}
	else
	{
		this.AMorPM = "PM";
	}
	this.ShowSeconds = false;
	this.EnableDateMode = ""
}

Calendar.prototype.GetMonthIndex = function (shortMonthName)
{
	for (var i = 0; i < 12; i += 1)
	{
		if (MonthName[i].substring(0, 3).toUpperCase() === shortMonthName.toUpperCase())
		{
			return i;
		}
	}
};

Calendar.prototype.IncYear = function () {
    if (Cal.Year <= dtToday.getFullYear()+EndYear)
	    Cal.Year += 1;
};

Calendar.prototype.DecYear = function () {
    if (Cal.Year > StartYear)
	    Cal.Year -= 1;
};

Calendar.prototype.IncMonth = function() {
    if (Cal.Year <= dtToday.getFullYear() + EndYear) {
        Cal.Month += 1;
        if (Cal.Month >= 12) {
            Cal.Month = 0;
            Cal.IncYear();
        }
    }
};

Calendar.prototype.DecMonth = function() {
    if (Cal.Year >= StartYear) {
        Cal.Month -= 1;
        if (Cal.Month < 0) {
            Cal.Month = 11;
            Cal.DecYear();
        }
    }
};

Calendar.prototype.SwitchMth = function (intMth)
{
	Cal.Month = parseInt(intMth, 10);
};

Calendar.prototype.SwitchYear = function (intYear)
{
	Cal.Year = parseInt(intYear, 10);
};

Calendar.prototype.SetHour = function(intHour) {
    var MaxHour,
	MinHour,
	HourExp = new RegExp("^\\d\\d"),
	SingleDigit = new RegExp("^\\d{1}$");

    if (TimeMode === 24) {
        MaxHour = 23;
        MinHour = 0;
    }
    else if (TimeMode === 12) {
        MaxHour = 12;
        MinHour = 1;
    }
    else {
        alert("TimeMode can only be 12 or 24");
    }

    if ((HourExp.test(intHour) || SingleDigit.test(intHour)) && (parseInt(intHour, 10) > MaxHour)) {
        intHour = MinHour;
    }

    else if ((HourExp.test(intHour) || SingleDigit.test(intHour)) && (parseInt(intHour, 10) < MinHour)) {
        intHour = MaxHour;
    }

    intHour = parseInt(intHour, 10);
    if (SingleDigit.test(intHour)) {
        intHour = "0" + intHour;
    }

    if (HourExp.test(intHour) && (parseInt(intHour, 10) <= MaxHour) && (parseInt(intHour, 10) >= MinHour)) {
        if ((TimeMode === 12) && (Cal.AMorPM === "PM")) {
            if (parseInt(intHour, 10) === 12) {
                Cal.Hours = 12;
            }
            else {
                Cal.Hours = parseInt(intHour, 10) + 12;
            }
        }

        else if ((TimeMode === 12) && (Cal.AMorPM === "AM")) {
            if (intHour === 12) {
                intHour -= 12;
            }

            Cal.Hours = parseInt(intHour, 10);
        }

        else if (TimeMode === 24) {
            Cal.Hours = parseInt(intHour, 10);
        }
    }

};

Calendar.prototype.SetMinute = function (intMin)
{
	var MaxMin = 59,
	MinMin = 0,

	SingleDigit = new RegExp("\\d"),
	SingleDigit2 = new RegExp("^\\d{1}$"),
	MinExp = new RegExp("^\\d{2}$"),

	strMin = 0;

	if ((MinExp.test(intMin) || SingleDigit.test(intMin)) && (parseInt(intMin, 10) > MaxMin))
	{
		intMin = MinMin;
	}

	else if ((MinExp.test(intMin) || SingleDigit.test(intMin)) && (parseInt(intMin, 10) < MinMin))
	{
		intMin = MaxMin;
	}

	strMin = intMin + "";
	if (SingleDigit2.test(intMin))
	{
		strMin = "0" + strMin;
	}

	if ((MinExp.test(intMin) || SingleDigit.test(intMin)) && (parseInt(intMin, 10) <= 59) && (parseInt(intMin, 10) >= 0))
	{
		Cal.Minutes = strMin;
	}
};

Calendar.prototype.SetSecond = function (intSec)
{
	var MaxSec = 59,
	MinSec = 0,

	SingleDigit = new RegExp("\\d"),
	SingleDigit2 = new RegExp("^\\d{1}$"),
	SecExp = new RegExp("^\\d{2}$"),

	strSec = 0;

	if ((SecExp.test(intSec) || SingleDigit.test(intSec)) && (parseInt(intSec, 10) > MaxSec))
	{
		intSec = MinSec;
	}

	else if ((SecExp.test(intSec) || SingleDigit.test(intSec)) && (parseInt(intSec, 10) < MinSec))
	{
		intSec = MaxSec;
	}

	strSec = intSec + "";
	if (SingleDigit2.test(intSec))
	{
		strSec = "0" + strSec;
	}

	if ((SecExp.test(intSec) || SingleDigit.test(intSec)) && (parseInt(intSec, 10) <= 59) && (parseInt(intSec, 10) >= 0))
	{
		Cal.Seconds = strSec;
	}

};

Calendar.prototype.SetAmPm = function (pvalue)
{
	this.AMorPM = pvalue;
	if (pvalue === "PM")
	{
		this.Hours = parseInt(this.Hours, 10) + 12;
		if (this.Hours === 24)
		{
			this.Hours = 12;
		}
	}

	else if (pvalue === "AM")
	{
		this.Hours -= 12;
	}
};

Calendar.prototype.getShowHour = function() {
    var finalHour;

    if (TimeMode === 12) {
        if (parseInt(this.Hours, 10) === 0) {
            this.AMorPM = "AM";
            finalHour = parseInt(this.Hours, 10) + 12;
        }

        else if (parseInt(this.Hours, 10) === 12) {
            this.AMorPM = "PM";
            finalHour = 12;
        }

        else if (this.Hours > 12) {
            this.AMorPM = "PM";
            if ((this.Hours - 12) < 10) {
                finalHour = "0" + ((parseInt(this.Hours, 10)) - 12);
            }
            else {
                finalHour = parseInt(this.Hours, 10) - 12;
            }
        }
        else {
            this.AMorPM = "AM";
            if (this.Hours < 10) {
                finalHour = "0" + parseInt(this.Hours, 10);
            }
            else {
                finalHour = this.Hours;
            }
        }
    }

    else if (TimeMode === 24) {
        if (this.Hours < 10) {
            finalHour = "0" + parseInt(this.Hours, 10);
        }
        else {
            finalHour = this.Hours;
        }
    }

    return finalHour;
};

Calendar.prototype.getShowAMorPM = function ()
{
	return this.AMorPM;
};

Calendar.prototype.GetMonthName = function (IsLong)
{
	var Month = MonthName[this.Month];
	if (IsLong)
	{
		return Month;
	}
	else
	{
		return Month.substr(0, 3);
	}
};

Calendar.prototype.GetMonDays = function() { //Get number of days in a month

    var DaysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    if (Cal.IsLeapYear()) {
        DaysInMonth[1] = 29;
    }

    return DaysInMonth[this.Month];
};

Calendar.prototype.IsLeapYear = function ()
{
	if ((this.Year % 4) === 0)
	{
		if ((this.Year % 100 === 0) && (this.Year % 400) !== 0)
		{
			return false;
		}
		else
		{
			return true;
		}
	}
	else
	{
		return false;
	}
};

Calendar.prototype.FormatDate = function (pDate)
{
	var MonthDigit = this.Month + 1;
	if (PrecedeZero === true)
	{
		if ((pDate < 10) && String(pDate).length===1) //length checking added in version 2.2
		{		
			pDate = "0" + pDate;
		}
		if (MonthDigit < 10)
		{
			MonthDigit = "0" + MonthDigit;
		}
	}

	switch (this.Format.toUpperCase())
	{
		case "DDMMYYYY":
		return (pDate + DateSeparator + MonthDigit + DateSeparator + this.Year);
		case "DDMMMYYYY":
		return (pDate + DateSeparator + this.GetMonthName(false) + DateSeparator + this.Year);
		case "MMDDYYYY":
		return (MonthDigit + DateSeparator + pDate + DateSeparator + this.Year);
		case "MMMDDYYYY":
		return (this.GetMonthName(false) + DateSeparator + pDate + DateSeparator + this.Year);
		case "YYYYMMDD":
		return (this.Year + DateSeparator + MonthDigit + DateSeparator + pDate);
		case "YYMMDD":
		return (String(this.Year).substring(2, 4) + DateSeparator + MonthDigit + DateSeparator + pDate);
		case "YYMMMDD":
		return (String(this.Year).substring(2, 4) + DateSeparator + this.GetMonthName(false) + DateSeparator + pDate);
		case "YYYYMMMDD":
		return (this.Year + DateSeparator + this.GetMonthName(false) + DateSeparator + pDate);
		default:
		return (pDate + DateSeparator + (this.Month + 1) + DateSeparator + this.Year);
	}
};

// end Calendar prototype

function GenCell(pValue, pHighLight, pColor, pClickable)
{ //Generate table cell with value
	var PValue,
	PCellStr,
	PClickable,
	vTimeStr;

	if (!pValue)
	{
		PValue = "";
	}
	else
	{
		PValue = pValue;
	}

	if (pColor === undefined)
	    pColor = CalBgColor;
	
	if (pClickable !== undefined){
		PClickable = pClickable;
	}
	else{
		PClickable = true;
	}

	if (Cal.ShowTime)
	{
		vTimeStr = ' ' + Cal.Hours + ':' + Cal.Minutes;
		if (Cal.ShowSeconds)
		{
			vTimeStr += ':' + Cal.Seconds;
		}
		if (TimeMode === 12)
		{
			vTimeStr += ' ' + Cal.AMorPM;
		}
	}

	else
	{
		vTimeStr = "";
	}

	if (PValue !== "")
	{
		if (PClickable === true) {
		    if (Cal.ShowTime === true)
		    { PCellStr = "<td id='c" + PValue + "' class='calTD' style='text-align:center;cursor:pointer;background-color:"+pColor+"' onmousedown='selectDate(this," + PValue + ");'>" + PValue + "</td>"; }
		    else { PCellStr = "<td class='calTD' style='text-align:center;cursor:pointer;background-color:" + pColor + "' onmouseover='changeBorder(this, 0);' onmouseout=\"changeBorder(this, 1, '" + pColor + "');\" onClick=\"javascript:callback('" + Cal.Ctrl + "','" + Cal.FormatDate(PValue) + "');\">" + PValue + "</td>"; }
		}
		else
		{ PCellStr = "<td style='text-align:center;background-color:"+pColor+"' class='calTD'>"+PValue+"</td>"; }
	}
	else
	{ PCellStr = "<td style='text-align:center;background-color:"+pColor+"' class='calTD'>&nbsp;</td>"; }

	return PCellStr;
}

function RenderCssCal(bNewCal)
{
	if (typeof bNewCal === "undefined" || bNewCal !== true)
	{
		bNewCal = false;
	}
	var vCalHeader,
	vCalData,
	vCalTime = "",
	vCalClosing = "",
	winCalData = "",
	CalDate,

	i,
	j,

	SelectStr,
	vDayCount = 0,
	vFirstDay,

	WeekDayName = [],//Added version 1.7
	strCell,

	showHour,
	ShowArrows = false,
	HourCellWidth = "35px", //cell width with seconds.

	SelectAm,
	SelectPm,

	funcCalback,

	headID,
	e,
	cssStr,
	style,
	cssText,
	span;

	calHeight = 0; // reset the window height on refresh

	// Set the default cursor for the calendar

	winCalData = "<span style='cursor:auto;'>";
	vCalHeader = "<table style='background-color:"+CalBgColor+";width:200px;padding:0;margin:5px auto 5px auto'><tbody>";

	//Table for Month & Year Selector

	vCalHeader += "<tr><td colspan='7'><table border='0' width='200px' cellpadding='0' cellspacing='0'><tr>";
	//******************Month and Year selector in dropdown list************************

	if (Cal.Scroller === "DROPDOWN")
	{
	    vCalHeader += "<td align='center'><select name='MonthSelector' onChange='javascript:Cal.SwitchMth(this.selectedIndex);RenderCssCal();'>";
		for (i = 0; i < 12; i += 1)
		{
			if (i === Cal.Month)
			{
				SelectStr = "Selected";
			}
			else
			{
				SelectStr = "";
			}
			vCalHeader += "<option " + SelectStr + " value=" + i + ">" + MonthName[i] + "</option>";
		}

		vCalHeader += "</select></td>";
		//Year selector

		vCalHeader += "<td align='center'><select name='YearSelector' size='1' onChange='javascript:Cal.SwitchYear(this.value);RenderCssCal();'>";
		for (i = StartYear; i <= (dtToday.getFullYear() + EndYear); i += 1)
		{
			if (i === Cal.Year)
			{
				SelectStr = 'selected="selected"';
			}
			else
			{
				SelectStr = '';
			}
			vCalHeader += "<option " + SelectStr + " value=" + i + ">" + i + "</option>\n";
		}
		vCalHeader += "</select></td>\n";
		calHeight += 30;
	}

	//******************End Month and Year selector in dropdown list*********************

	//******************Month and Year selector in arrow*********************************

	else if (Cal.Scroller === "ARROW")
	{
		if (UseImageFiles)
		{
			vCalHeader += "<td><img onmousedown='javascript:Cal.DecYear();RenderCssCal();' src='"+imageFilesPath+"cal_fastreverse.gif' width='13px' height='9' onmouseover='changeBorder(this, 0)' onmouseout='changeBorder(this, 1)' style='border:1px solid white'></td>\n";//Year scroller (decrease 1 year)
			vCalHeader += "<td><img onmousedown='javascript:Cal.DecMonth();RenderCssCal();' src='" + imageFilesPath + "cal_reverse.gif' width='13px' height='9' onmouseover='changeBorder(this, 0)' onmouseout='changeBorder(this, 1)' style='border:1px solid white'></td>\n"; //Month scroller (decrease 1 month)
			vCalHeader += "<td width='70%' class='calR' style='color:"+YrSelColor+"'>"+ Cal.GetMonthName(ShowLongMonth) + " " + Cal.Year + "</td>"; //Month and Year
			vCalHeader += "<td><img onmousedown='javascript:Cal.IncMonth();RenderCssCal();' src='" + imageFilesPath + "cal_forward.gif' width='13px' height='9' onmouseover='changeBorder(this, 0)' onmouseout='changeBorder(this, 1)' style='border:1px solid white'></td>\n"; //Month scroller (increase 1 month)
			vCalHeader += "<td><img onmousedown='javascript:Cal.IncYear();RenderCssCal();' src='" + imageFilesPath + "cal_fastforward.gif' width='13px' height='9' onmouseover='changeBorder(this, 0)' onmouseout='changeBorder(this, 1)' style='border:1px solid white'></td>\n"; //Year scroller (increase 1 year)
			calHeight += 22;
		}
		else
		{
			vCalHeader += "<td><span id='dec_year' title='reverse year' onmousedown='javascript:Cal.DecYear();RenderCssCal();' onmouseover='changeBorder(this, 0)' onmouseout='changeBorder(this, 1)' style='border:1px solid white; color:" + YrSelColor + "'>-</span></td>";//Year scroller (decrease 1 year)
			vCalHeader += "<td><span id='dec_month' title='reverse month' onmousedown='javascript:Cal.DecMonth();RenderCssCal();' onmouseover='changeBorder(this, 0)' onmouseout='changeBorder(this, 1)' style='border:1px solid white'>&lt;</span></td>\n";//Month scroller (decrease 1 month)
			vCalHeader += "<td width='70%' class='calR' style='color:" + YrSelColor + "'>" + Cal.GetMonthName(ShowLongMonth) + " " + Cal.Year + "</td>\n"; //Month and Year
			vCalHeader += "<td><span id='inc_month' title='forward month' onmousedown='javascript:Cal.IncMonth();RenderCssCal();' onmouseover='changeBorder(this, 0)' onmouseout='changeBorder(this, 1)' style='border:1px solid white'>&gt;</span></td>\n";//Month scroller (increase 1 month)
			vCalHeader += "<td><span id='inc_year' title='forward year' onmousedown='javascript:Cal.IncYear();RenderCssCal();'  onmouseover='changeBorder(this, 0)' onmouseout='changeBorder(this, 1)' style='border:1px solid white; color:" + YrSelColor + "'>+</span></td>\n";//Year scroller (increase 1 year)
			calHeight += 22;
		}
	}

	vCalHeader += "</tr></table></td></tr>";

	//******************End Month and Year selector in arrow******************************

	//Calendar header shows Month and Year
	if (ShowMonthYear && Cal.Scroller === "DROPDOWN")
	{
	    vCalHeader += "<tr><td colspan='7' class='calR' style='color:" + MonthYearColor + "'>" + Cal.GetMonthName(ShowLongMonth) + " " + Cal.Year + "</td></tr>";
		calHeight += 19;
	}

	//Week day header

	vCalHeader += "<tr><td colspan=\"7\"><table style='border-spacing:1px;border-collapse:separate;'><tr>";
	if (MondayFirstDay === true)
	{
		WeekDayName = WeekDayName2;
	}
	else
	{
		WeekDayName = WeekDayName1;
	}
	for (i = 0; i < 7; i += 1)
	{
	    vCalHeader += "<td style='background-color:"+WeekHeadColor+";width:"+CellWidth+"px;color:#FFFFFF' class='calTD'>" + WeekDayName[i].substr(0, WeekChar) + "</td>";
	}

	calHeight += 19;
	vCalHeader += "</tr>";
	//Calendar detail
	CalDate = new Date(Cal.Year, Cal.Month);
	CalDate.setDate(1);

	vFirstDay = CalDate.getDay();

	//Added version 1.7
	if (MondayFirstDay === true)
	{
		vFirstDay -= 1;
		if (vFirstDay === -1)
		{
			vFirstDay = 6;
		}
	}

	//Added version 1.7
	vCalData = "<tr>";
	calHeight += 19;
	for (i = 0; i < vFirstDay; i += 1)
	{
		vCalData = vCalData + GenCell();
		vDayCount = vDayCount + 1;
	}

	//Added version 1.7
	for (j = 1; j <= Cal.GetMonDays(); j += 1)
	{
		if ((vDayCount % 7 === 0) && (j > 1))
		{
			vCalData = vCalData + "<tr>";
		}

		vDayCount = vDayCount + 1;
		//added version 2.1.2
		if (Cal.EnableDateMode === "future" && ((j < dtToday.getDate()) && (Cal.Month === dtToday.getMonth()) && (Cal.Year === dtToday.getFullYear()) || (Cal.Month < dtToday.getMonth()) && (Cal.Year === dtToday.getFullYear()) || (Cal.Year < dtToday.getFullYear())))
		{
			strCell = GenCell(j, false, DisableColor, false); //Before today's date is not clickable
        }
        else if (Cal.EnableDateMode === "past" && ((j >= dtToday.getDate()) && (Cal.Month === dtToday.getMonth()) && (Cal.Year === dtToday.getFullYear()) || (Cal.Month > dtToday.getMonth()) && (Cal.Year === dtToday.getFullYear()) || (Cal.Year > dtToday.getFullYear()))) {
            strCell = GenCell(j, false, DisableColor, false); //After today's date is not clickable
        }
		//if End Year + Current Year = Cal.Year. Disable.
		else if (Cal.Year > (dtToday.getFullYear()+EndYear))
		{
		    strCell = GenCell(j, false, DisableColor, false); 
		}
		else if ((j === dtToday.getDate()) && (Cal.Month === dtToday.getMonth()) && (Cal.Year === dtToday.getFullYear()))
		{
			strCell = GenCell(j, true, TodayColor);//Highlight today's date
		}
		else
		{
			if ((j === selDate.getDate()) && (Cal.Month === selDate.getMonth()) && (Cal.Year === selDate.getFullYear())){
			     //modified version 1.7
				strCell = GenCell(j, true, SelDateColor);
            }
			else
			{
				if (MondayFirstDay === true)
				{
					if (vDayCount % 7 === 0)
					{
						strCell = GenCell(j, false, SundayColor);
					}
					else if ((vDayCount + 1) % 7 === 0)
					{
						strCell = GenCell(j, false, SaturdayColor);
					}
					else
					{
						strCell = GenCell(j, null, WeekDayColor);
					}
				}
				else
				{
					if (vDayCount % 7 === 0)
					{
						strCell = GenCell(j, false, SaturdayColor);
					}
					else if ((vDayCount + 6) % 7 === 0)
					{
						strCell = GenCell(j, false, SundayColor);
					}
					else
					{
						strCell = GenCell(j, null, WeekDayColor);
					}
				}
			}
		}

		vCalData = vCalData + strCell;

		if ((vDayCount % 7 === 0) && (j < Cal.GetMonDays()))
		{
			vCalData = vCalData + "</tr>";
			calHeight += 19;
		}
	}

	// finish the table proper

	if (vDayCount % 7 !== 0)
	{
		while (vDayCount % 7 !== 0)
		{
			vCalData = vCalData + GenCell();
			vDayCount = vDayCount + 1;
		}
	}

	vCalData = vCalData + "</table></td></tr>";


	//Time picker
	if (Cal.ShowTime === true)
	{
		showHour = Cal.getShowHour();

		if (Cal.ShowSeconds === false && TimeMode === 24)
		{
			ShowArrows = true;
			HourCellWidth = "65px";
		}

		vCalTime = "<tr><td colspan='7' style=\"text-align:center;\"><table border='0' width='199px' cellpadding='0' cellspacing='0'><tbody><tr><td height='5px' width='" + HourCellWidth + "'>&nbsp;</td>";

		if (ShowArrows && UseImageFiles) //this is where the up and down arrow control the hour.
		{
		    vCalTime += "<td style='vertical-align:middle;'><table cellspacing='0' cellpadding='0' style='line-height:0pt;width:100%;'><tr><td style='text-align:center;'><img onclick='nextStep(\"Hour\", \"plus\");' onmousedown='startSpin(\"Hour\", \"plus\");' onmouseup='stopSpin();' src='" + imageFilesPath + "cal_plus.gif' width='13px' height='9px' onmouseover='changeBorder(this, 0)' onmouseout='changeBorder(this, 1)' style='border:1px solid white'></td></tr><tr><td style='text-align:center;'><img onclick='nextStep(\"Hour\", \"minus\");' onmousedown='startSpin(\"Hour\", \"minus\");' onmouseup='stopSpin();' src='" + imageFilesPath + "cal_minus.gif' width='13px' height='9px' onmouseover='changeBorder(this, 0)' onmouseout='changeBorder(this, 1)' style='border:1px solid white'></td></tr></table></td>\n";
		}

		vCalTime += "<td width='22px'><input type='text' name='hour' maxlength=2 size=1 style=\"WIDTH:22px\" value=" + showHour + " onkeyup=\"javascript:Cal.SetHour(this.value)\">";
		vCalTime += "</td><td style='font-weight:bold;text-align:center;'>:</td><td width='22px'>";
		vCalTime += "<input type='text' name='minute' maxlength=2 size=1 style=\"WIDTH: 22px\" value=" + Cal.Minutes + " onkeyup=\"javascript:Cal.SetMinute(this.value)\">";

		if (Cal.ShowSeconds)
		{
		    vCalTime += "</td><td style='font-weight:bold;'>:</td><td width='22px'>";
			vCalTime += "<input type='text' name='second' maxlength=2 size=1 style=\"WIDTH: 22px\" value=" + Cal.Seconds + " onkeyup=\"javascript:Cal.SetSecond(parseInt(this.value,10))\">";
		}

		if (TimeMode === 12)
		{
			SelectAm = (Cal.AMorPM === "AM") ? "Selected" : "";
			SelectPm = (Cal.AMorPM === "PM") ? "Selected" : "";

			vCalTime += "</td><td>";
			vCalTime += "<select name=\"ampm\" onChange=\"javascript:Cal.SetAmPm(this.options[this.selectedIndex].value);\">\n";
			vCalTime += "<option " + SelectAm + " value=\"AM\">AM</option>";
			vCalTime += "<option " + SelectPm + " value=\"PM\">PM<option>";
			vCalTime += "</select>";
		}

		if (ShowArrows && UseImageFiles) //this is where the up and down arrow to change the "Minute".
		{
		    vCalTime += "</td>\n<td style='vertical-align:middle;'><table cellspacing='0' cellpadding='0' style='line-height:0pt;width:100%'><tr><td style='text-align:center;'><img onclick='nextStep(\"Minute\", \"plus\");' onmousedown='startSpin(\"Minute\", \"plus\");' onmouseup='stopSpin();' src='" + imageFilesPath + "cal_plus.gif' width='13px' height='9px' onmouseover='changeBorder(this, 0)' onmouseout='changeBorder(this, 1)' style='border:1px solid white'></td></tr><tr><td style='text-align:center;'><img onmousedown='startSpin(\"Minute\", \"minus\");' onmouseup='stopSpin();' onclick='nextStep(\"Minute\",\"minus\");' src='" + imageFilesPath + "cal_minus.gif' width='13px' height='9px' onmouseover='changeBorder(this, 0)' onmouseout='changeBorder(this, 1)' style='border:1px solid white'></td></tr></table>";
		}

		vCalTime += "</td>\n<td align='right' valign='bottom' width='" + HourCellWidth + "'></td></tr>";
		vCalTime += "<tr><td colspan='8' style=\"text-align:center;\"><input style='width:60px;font-size:12px;' onClick='javascript:closewin(\"" + Cal.Ctrl + "\");'  type=\"button\" value=\"OK\">&nbsp;<input style='width:60px;font-size:12px;' onClick='javascript: winCal.style.visibility = \"hidden\"' type=\"button\" value=\"Cancel\"></td></tr>";
	}
	else //if not to show time.
	{
	    vCalTime += "\n<tr>\n<td colspan='7' style=\"text-align:right;\">";
	    //close button
	    if (UseImageFiles) {
	        vCalClosing += "<img onmousedown='javascript:closewin(\"" + Cal.Ctrl + "\"); stopSpin();' src='"+imageFilesPath+"cal_close.gif' width='16px' height='14px' onmouseover='changeBorder(this,0)' onmouseout='changeBorder(this, 1)' style='border:1px solid white'></td>";
	    }
	    else {
	        vCalClosing += "<span id='close_cal' title='close'onmousedown='javascript:closewin(\"" + Cal.Ctrl + "\");stopSpin();' onmouseover='changeBorder(this, 0)'onmouseout='changeBorder(this, 1)' style='border:1px solid white; font-family: Arial;font-size: 10pt;'>x</span></td>";
	    }
	    vCalClosing += "</tr>";
	}
	vCalClosing += "</tbody></table></td></tr>";
	calHeight += 31;
	vCalClosing += "</tbody></table>\n</span>";

	//end time picker
	funcCalback = "function callback(id, datum) {";
	funcCalback += " var CalId = document.getElementById(id);if (datum=== 'undefined') { var d = new Date(); datum = d.getDate() + '/' +(d.getMonth()+1) + '/' + d.getFullYear(); } window.calDatum=datum;CalId.value=datum;";
	funcCalback += " if(Cal.ShowTime){";
	funcCalback += " CalId.value+=' '+Cal.getShowHour()+':'+Cal.Minutes;";
	funcCalback += " if (Cal.ShowSeconds)  CalId.value+=':'+Cal.Seconds;";
	funcCalback += " if (TimeMode === 12)  CalId.value+=''+Cal.getShowAMorPM();";
	funcCalback += " window.NfireEvent(CalId, 'change');";
	funcCalback += "}if(CalId.onchange!=undefined) CalId.onchange();CalId.focus();winCal.style.visibility='hidden';}";


	// determines if there is enough space to open the cal above the position where it is called
	if (ypos > calHeight)
	{
		ypos = ypos - calHeight;
	}

	if (!winCal)
	{
		headID = document.getElementsByTagName("head")[0];

		// add javascript function to the span cal
		e = document.createElement("script");
		e.type = "text/javascript";
		e.language = "javascript";
		e.text = funcCalback;
		headID.appendChild(e);
		// add stylesheet to the span cal

		cssStr = ".calTD {font-family: verdana; font-size: 12px; text-align: center; border:0; }\n";
		cssStr += ".calR {font-family: verdana; font-size: 12px; text-align: center; font-weight: bold;}";

		style = document.createElement("style");
		style.type = "text/css";
		style.rel = "stylesheet";
		if (style.styleSheet)
		{ // IE
			style.styleSheet.cssText = cssStr;
		}

		else
		{ // w3c
			cssText = document.createTextNode(cssStr);
			style.appendChild(cssText);
		}

		headID.appendChild(style);
		// create the outer frame that allows the cal. to be moved
		span = document.createElement("span");
		span.id = calSpanID;
		span.style.position = "absolute";
		span.style.left = (xpos + CalPosOffsetX) + 'px';
		span.style.top = (ypos - CalPosOffsetY) + 'px';
		span.style.width = CalWidth + 'px';
		span.style.border = "solid 1pt " + SpanBorderColor;
		span.style.padding = "0";
		span.style.cursor = "move";
		span.style.backgroundColor = SpanBgColor;
		span.style.zIndex = 100;
		document.body.appendChild(span);
		winCal = document.getElementById(calSpanID);
	}

	else
	{
		winCal.style.visibility = "visible";
		winCal.style.Height = calHeight;

		// set the position for a new calendar only
		if (bNewCal === true)
		{
			winCal.style.left = (xpos + CalPosOffsetX) + 'px';
			winCal.style.top = (ypos - CalPosOffsetY) + 'px';
		}
	}

	winCal.innerHTML = winCalData + vCalHeader + vCalData + vCalTime + vCalClosing;
	return true;
}


function NewCssCal(pCtrl, pFormat, pScroller, pShowTime, pTimeMode, pShowSeconds, pEnableDateMode)
{
	// get current date and time

	dtToday = new Date();
	Cal = new Calendar(dtToday);

	if (pShowTime !== undefined)
	{
	    if (pShowTime) {
	        Cal.ShowTime = true;
	    }
	    else {
	        Cal.ShowTime = false;
	    }

		if (pTimeMode)
		{
			pTimeMode = parseInt(pTimeMode, 10);
		}
		if (pTimeMode === 12 || pTimeMode === 24)
		{
			TimeMode = pTimeMode;
		}
		else
		{
			TimeMode = 24;
		}

		if (pShowSeconds !== undefined)
		{
			if (pShowSeconds)
			{
				Cal.ShowSeconds = true;
			}
			else
			{
				Cal.ShowSeconds = false;
			}
		}
		else
		{
			Cal.ShowSeconds = false;
		}

	}

	if (pCtrl !== undefined)
	{
		Cal.Ctrl = pCtrl;
	}

	if (pFormat!== undefined && pFormat !=="")
	{
		Cal.Format = pFormat.toUpperCase();
	}
	else
	{
		Cal.Format = "MMDDYYYY";
	}

	if (pScroller!== undefined && pScroller!=="")
	{
		if (pScroller.toUpperCase() === "ARROW")
		{
			Cal.Scroller = "ARROW";
		}
		else
		{
			Cal.Scroller = "DROPDOWN";
		}
    }

    if (pEnableDateMode !== undefined && (pEnableDateMode === "future" || pEnableDateMode === "past")) {
        Cal.EnableDateMode= pEnableDateMode;
    }

	exDateTime = document.getElementById(pCtrl).value; //Existing Date Time value in textbox.

	if (exDateTime)
	{ //Parse existing Date String
		var Sp1 = exDateTime.indexOf(DateSeparator, 0),//Index of Date Separator 1
		Sp2 = exDateTime.indexOf(DateSeparator, parseInt(Sp1, 10) + 1),//Index of Date Separator 2
		tSp1,//Index of Time Separator 1
		tSp2,//Index of Time Separator 2
		strMonth,
		strDate,
		strYear,
		intMonth,
		YearPattern,
		strHour,
		strMinute,
		strSecond,
		winHeight,
		offset = parseInt(Cal.Format.toUpperCase().lastIndexOf("M"), 10) - parseInt(Cal.Format.toUpperCase().indexOf("M"), 10) - 1,
		strAMPM = "";
		//parse month

		if (Cal.Format.toUpperCase() === "DDMMYYYY" || Cal.Format.toUpperCase() === "DDMMMYYYY")
		{
			if (DateSeparator === "")
			{
				strMonth = exDateTime.substring(2, 4 + offset);
				strDate = exDateTime.substring(0, 2);
				strYear = exDateTime.substring(4 + offset, 8 + offset);
			}
			else
			{
				if (exDateTime.indexOf("D*") !== -1)
				{   //DTG
					strMonth = exDateTime.substring(8, 11);
					strDate  = exDateTime.substring(0, 2);
					strYear  = "20" + exDateTime.substring(11, 13);  //Hack, nur für Jahreszahlen ab 2000
				}
				else
				{
					strMonth = exDateTime.substring(Sp1 + 1, Sp2);
					strDate = exDateTime.substring(0, Sp1);
					strYear = exDateTime.substring(Sp2 + 1, Sp2 + 5);
				}
			}
		}

		else if (Cal.Format.toUpperCase() === "MMDDYYYY" || Cal.Format.toUpperCase() === "MMMDDYYYY"){
			if (DateSeparator === ""){
				strMonth = exDateTime.substring(0, 2 + offset);
				strDate = exDateTime.substring(2 + offset, 4 + offset);
				strYear = exDateTime.substring(4 + offset, 8 + offset);
			}
			else{
				strMonth = exDateTime.substring(0, Sp1);
				strDate = exDateTime.substring(Sp1 + 1, Sp2);
				strYear = exDateTime.substring(Sp2 + 1, Sp2 + 5);
			}
		}

		else if (Cal.Format.toUpperCase() === "YYYYMMDD" || Cal.Format.toUpperCase() === "YYYYMMMDD")
		{
			if (DateSeparator === ""){
				strMonth = exDateTime.substring(4, 6 + offset);
				strDate = exDateTime.substring(6 + offset, 8 + offset);
				strYear = exDateTime.substring(0, 4);
			}
			else{
				strMonth = exDateTime.substring(Sp1 + 1, Sp2);
				strDate = exDateTime.substring(Sp2 + 1, Sp2 + 3);
				strYear = exDateTime.substring(0, Sp1);
			}
		}

		else if (Cal.Format.toUpperCase() === "YYMMDD" || Cal.Format.toUpperCase() === "YYMMMDD")
		{
			if (DateSeparator === "")
			{
				strMonth = exDateTime.substring(2, 4 + offset);
				strDate = exDateTime.substring(4 + offset, 6 + offset);
				strYear = exDateTime.substring(0, 2);
			}
			else
			{
				strMonth = exDateTime.substring(Sp1 + 1, Sp2);
				strDate = exDateTime.substring(Sp2 + 1, Sp2 + 3);
				strYear = exDateTime.substring(0, Sp1);
			}
		}

		if (isNaN(strMonth)){
			intMonth = Cal.GetMonthIndex(strMonth);
		}
		else{
			intMonth = parseInt(strMonth, 10) - 1;
		}
		if ((parseInt(intMonth, 10) >= 0) && (parseInt(intMonth, 10) < 12))	{
			Cal.Month = intMonth;
		}
		//end parse month

		//parse year
		YearPattern = /^\d{4}$/;
		if (YearPattern.test(strYear)) {
		    if ((parseInt(strYear, 10)>=StartYear) && (parseInt(strYear, 10)<= (dtToday.getFullYear()+EndYear)))
		        Cal.Year = parseInt(strYear, 10);
		}
		//end parse year
		
		//parse Date
		if ((parseInt(strDate, 10) <= Cal.GetMonDays()) && (parseInt(strDate, 10) >= 1)) {
			Cal.Date = strDate;
		}
		//end parse Date

		//parse time

		if (Cal.ShowTime === true)
		{
			//parse AM or PM
			if (TimeMode === 12)
			{
				strAMPM = exDateTime.substring(exDateTime.length - 2, exDateTime.length);
				Cal.AMorPM = strAMPM;
			}

			tSp1 = exDateTime.indexOf(":", 0);
			tSp2 = exDateTime.indexOf(":", (parseInt(tSp1, 10) + 1));
			if (tSp1 > 0)
			{
				strHour = exDateTime.substring(tSp1, tSp1 - 2);
				Cal.SetHour(strHour);

				strMinute = exDateTime.substring(tSp1 + 1, tSp1 + 3);
				Cal.SetMinute(strMinute);

				strSecond = exDateTime.substring(tSp2 + 1, tSp2 + 3);
				Cal.SetSecond(strSecond);

			}
			else if (exDateTime.indexOf("D*") !== -1)
			{   //DTG
				strHour = exDateTime.substring(2, 4);
				Cal.SetHour(strHour);
				strMinute = exDateTime.substring(4, 6);
				Cal.SetMinute(strMinute);

			}
		}

	}
	selDate = new Date(Cal.Year, Cal.Month, Cal.Date);//version 1.7
	RenderCssCal(true);
}

function closewin(id) {
    if (Cal.ShowTime === true) {
        var MaxYear = dtToday.getFullYear() + EndYear;
        var beforeToday =
                    (Cal.Date < dtToday.getDate()) &&
                    (Cal.Month === dtToday.getMonth()) &&
                    (Cal.Year === dtToday.getFullYear())
                    ||
                    (Cal.Month < dtToday.getMonth()) &&
                    (Cal.Year === dtToday.getFullYear())
                    ||
                    (Cal.Year < dtToday.getFullYear());

        if ((Cal.Year <= MaxYear) && (Cal.Year >= StartYear) && (Cal.Month === selDate.getMonth()) && (Cal.Year === selDate.getFullYear())) {
            if (Cal.EnableDateMode === "future") {
                if (beforeToday === false) {
                    callback(id, Cal.FormatDate(Cal.Date));
                }
            }
            else
                callback(id, Cal.FormatDate(Cal.Date));
        }
    }
    
	var CalId = document.getElementById(id);
	CalId.focus();
	winCal.style.visibility = 'hidden';
}

function changeBorder(element, col, oldBgColor)
{
	if (col === 0)
	{
		element.style.background = HoverColor;
		element.style.borderColor = "black";
		element.style.cursor = "pointer";
	}

	else
	{
		if (oldBgColor)
		{
			element.style.background = oldBgColor;
		}
		else
		{
			element.style.background = "white";
		}
		element.style.borderColor = "white";
		element.style.cursor = "auto";
	}
}

function selectDate(element, date) {
    Cal.Date = date;
    selDate = new Date(Cal.Year, Cal.Month, Cal.Date);
    element.style.background = SelDateColor;
    RenderCssCal();
}

function pickIt(evt)
{
	var objectID,
	dom,
	de,
	b;
	// accesses the element that generates the event and retrieves its ID
	if (document.addEventListener)
	{ // w3c
		objectID = evt.target.id;
		if (objectID.indexOf(calSpanID) !== -1)
		{
			dom = document.getElementById(objectID);
			cnLeft = evt.pageX;
			cnTop = evt.pageY;

			if (dom.offsetLeft)
			{
				cnLeft = (cnLeft - dom.offsetLeft);
				cnTop = (cnTop - dom.offsetTop);
			}
		}

		// get mouse position on click
		xpos = (evt.pageX);
		ypos = (evt.pageY);
	}

	else
	{ // IE
		objectID = event.srcElement.id;
		cnLeft = event.offsetX;
		cnTop = (event.offsetY);

		// get mouse position on click
		de = document.documentElement;
		b = document.body;

		xpos = event.clientX + (de.scrollLeft || b.scrollLeft) - (de.clientLeft || 0);
		ypos = event.clientY + (de.scrollTop || b.scrollTop) - (de.clientTop || 0);
	}

	// verify if this is a valid element to pick
	if (objectID.indexOf(calSpanID) !== -1)
	{
		domStyle = document.getElementById(objectID).style;
	}

	if (domStyle)
	{
		domStyle.zIndex = 100;
		return false;
	}

	else
	{
		domStyle = null;
		return;
	}
}



function dragIt(evt)
{
	if (domStyle)
	{
		if (document.addEventListener)
		{ //for IE
			domStyle.left = (event.clientX - cnLeft + document.body.scrollLeft) + 'px';
			domStyle.top = (event.clientY - cnTop + document.body.scrollTop) + 'px';
		}
		else
		{  //Firefox
			domStyle.left = (evt.clientX - cnLeft + document.body.scrollLeft) + 'px';
			domStyle.top = (evt.clientY - cnTop + document.body.scrollTop) + 'px';
		}
	}
}

// performs a single increment or decrement
function nextStep(whatSpinner, direction)
{
	if (whatSpinner === "Hour")
	{
		if (direction === "plus")
		{
			Cal.SetHour(Cal.Hours + 1);
			RenderCssCal();
		}
		else if (direction === "minus")
		{
			Cal.SetHour(Cal.Hours - 1);
			RenderCssCal();
		}
	}
	else if (whatSpinner === "Minute")
	{
		if (direction === "plus")
		{
			Cal.SetMinute(parseInt(Cal.Minutes, 10) + 1);
			RenderCssCal();
		}
		else if (direction === "minus")
		{
			Cal.SetMinute(parseInt(Cal.Minutes, 10) - 1);
			RenderCssCal();
		}
	}

}

// starts the time spinner
function startSpin(whatSpinner, direction)
{
	document.thisLoop = setInterval(function ()
	{
		nextStep(whatSpinner, direction);
	}, 125); //125 ms
}

//stops the time spinner
function stopSpin()
{
	clearInterval(document.thisLoop);
}

function dropIt()
{
	stopSpin();

	if (domStyle)
	{
		domStyle = null;
	}
}

// Default events configuration

document.onmousedown = pickIt;
document.onmousemove = dragIt;
document.onmouseup = dropIt;


/* Simple JavaScript Inheritance
 * By John Resig http://ejohn.org/
 * MIT Licensed.
 */
// Inspired by base2 and Prototype
(function() {
    var initializing = false, fnTest = /xyz/.test(function() {
        xyz;
    }) ? /\b_super\b/ : /.*/;

    // The base Class implementation (does nothing)
    this.NClass = function() {
    };

    // Create a new Class that inherits from this class
    NClass.extend = function(prop) {
        var _super = this.prototype;

        // Instantiate a base class (but only create the instance,
        // don't run the init constructor)
        initializing = true;
        var prototype = new this();
        initializing = false;

        // Copy the properties over onto the new prototype
        for (var name in prop) {
            // Check if we're overwriting an existing function
            prototype[name] = typeof prop[name] == "function" &&
                    typeof _super[name] == "function" && fnTest.test(prop[name]) ?
                    (function(name, fn) {
                        return function() {
                            var tmp = this._super;

                            // Add a new ._super() method that is the same method
                            // but on the super-class
                            this._super = _super[name];

                            // The method only need to be bound temporarily, so we
                            // remove it when we're done executing
                            var ret = fn.apply(this, arguments);
                            this._super = tmp;

                            return ret;
                        };
                    })(name, prop[name]) :
                    prop[name];
        }

        // The dummy class constructor
        function NClass() {
            var $this = this;
            // All construction is actually done in the init method
            if (!initializing && this.init)
                this.init.apply(this, arguments);
        }

        // Populate our constructed prototype object
        NClass.prototype = prototype;

        // Enforce the constructor to be what we expect
        NClass.prototype.constructor = NClass;

        // And make this class extendable
        NClass.extend = arguments.callee;

        return NClass;
    };
})();

window.njQuery = typeof jQuery == "undefined" ? null : jQuery;

(function ($) {
    if(typeof bindNextendQ != 'undefined'){
        $.each(bindNextendQ, function (index, a) {
            $(a[0])[a[1]](a[2]);
        });
    }
})(njQuery);
(function($) {
    var uaMatch = '', prefix = '';
    
    var dir = $(document.documentElement).attr('dir');
    if(!dir) dir = 'ltr';
    $('html').addClass('x-'+dir);
    window.nextendDir = dir;

    if (navigator.userAgent.match(/Windows/))
    {
        $('html').addClass('x-win');
    }
    else if (navigator.userAgent.match(/Mac OS X/))
    {
        $('html').addClass('x-mac');
    }
    else if (navigator.userAgent.match(/X11/))
    {
        $('html').addClass('x-x11');
    }

    if (navigator.userAgent.match(/Chrome/))
    {
        uaMatch = ' Chrome/';
        prefix = 'x-chrome';
    }
    else if (navigator.userAgent.match(/Safari/))
    {
        uaMatch = ' Version/';
        prefix = 'x-safari';
    }
    else if (navigator.userAgent.match(/Firefox/))
    {
        uaMatch = ' Firefox/';
        prefix = 'x-firefox';
    }
    else if (navigator.userAgent.match(/MSIE/))
    {
        uaMatch = ' MSIE ';
        prefix = 'x-msie';
    }
    if (prefix)
    {
        $('html').addClass(prefix);

        uaMatch = new RegExp(uaMatch + '(\\d+)\.(\\d+)');
        var uaMatch = navigator.userAgent.match(uaMatch);
        if (uaMatch && uaMatch[1])
        {
            $('html').addClass(prefix + '-' + uaMatch[1]);
            $('html').addClass(prefix + '-' + uaMatch[1] + '-' + uaMatch[2]);
        }
    }
})(njQuery);/**
 * jquery.unique-element-id.js
 *
 * A simple jQuery plugin to get a unique ID for
 * any HTML element
 *
 * Usage:
 *    $('some_element_selector').uid();
 *
 * by Jamie Rumbelow <jamie@jamierumbelow.net>
 * http://jamieonsoftware.com
 * Copyright (c)2011 Jamie Rumbelow
 *
 * Licensed under the MIT license (http://www.opensource.org/licenses/MIT)
 */

(function($){
    /**
     * Generate a new unqiue ID
     */
    function generateUniqueId() {

        // Return a unique ID
        return "nextend-element-" + Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }

    /**
     * Get a unique ID for an element, ensuring that the
     * element has an id="" attribute
     */
    $.fn.uid = function(){
        // We need an element! Check the selector returned something
        if (!this.length > 0) {
            return generateUniqueId();
        }

        // Act on only the first element. Also, fetch the element's ID attr
        var first_element = this.first();

        // No? Generate one!
        id_attr = generateUniqueId();

        // And set the ID attribute
        first_element.attr('id', id_attr);

        // Return it
        return id_attr;
    };
})(njQuery);/*! qTip2 v2.0.1-28- (includes: svg ajax tips modal viewport imagemap ie6 / basic css3) | qtip2.com | Licensed MIT, GPL | Fri Mar 01 2013 22:50:30 */

(function (jQuery) {

(function(e,t,n){(function(e){"use strict";typeof define=="function"&&define.amd?define(["jquery"],e):jQuery&&!jQuery.fn.qtip&&e(jQuery)})(function(r){function P(n){S={pageX:n.pageX,pageY:n.pageY,type:"mousemove",scrollX:e.pageXOffset||t.body.scrollLeft||t.documentElement.scrollLeft,scrollY:e.pageYOffset||t.body.scrollTop||t.documentElement.scrollTop}}function H(e){var t=function(e){return e===o||"object"!=typeof e},n=function(e){return!r.isFunction(e)&&(!e&&!e.attr||e.length<1||"object"==typeof e&&!e.jquery&&!e.then)};if(!e||"object"!=typeof e)return s;t(e.metadata)&&(e.metadata={type:e.metadata});if("content"in e){if(t(e.content)||e.content.jquery)e.content={text:e.content};n(e.content.text||s)&&(e.content.text=s),"title"in e.content&&(t(e.content.title)&&(e.content.title={text:e.content.title}),n(e.content.title.text||s)&&(e.content.title.text=s))}return"position"in e&&t(e.position)&&(e.position={my:e.position,at:e.position}),"show"in e&&t(e.show)&&(e.show=e.show.jquery?{target:e.show}:e.show===i?{ready:i}:{event:e.show}),"hide"in e&&t(e.hide)&&(e.hide=e.hide.jquery?{target:e.hide}:{event:e.hide}),"style"in e&&t(e.style)&&(e.style={classes:e.style}),r.each(E,function(){this.sanitize&&this.sanitize(e)}),e}function B(n,u,a,f){function R(e){var t=0,n,r=u,i=e.split(".");while(r=r[i[t++]])t<i.length&&(n=r);return[n||u,i.pop()]}function U(e){return C.concat("").join(e?"-"+e+" ":" ")}function z(){var e=u.style.widget,t=B.hasClass(F);B.removeClass(F),F=e?"ui-state-disabled":"qtip-disabled",B.toggleClass(F,t),B.toggleClass("ui-helper-reset "+U(),e).toggleClass(L,u.style.def&&!e),I.content&&I.content.toggleClass(U("content"),e),I.titlebar&&I.titlebar.toggleClass(U("header"),e),I.button&&I.button.toggleClass(x+"-icon",!e)}function W(e){I.title&&(I.titlebar.remove(),I.titlebar=I.title=I.button=o,e!==s&&l.reposition())}function X(){var e=u.content.title.button,t=typeof e=="string",n=t?e:"Close tooltip";I.button&&I.button.remove(),e.jquery?I.button=e:I.button=r("<a />",{"class":"qtip-close "+(u.style.widget?"":x+"-icon"),title:n,"aria-label":n}).prepend(r("<span />",{"class":"ui-icon ui-icon-close",html:"&times;"})),I.button.appendTo(I.titlebar||B).attr("role","button").click(function(e){return B.hasClass(F)||l.hide(e),s})}function V(){var e=g+"-title";I.titlebar&&W(),I.titlebar=r("<div />",{"class":x+"-titlebar "+(u.style.widget?U("header"):"")}).append(I.title=r("<div />",{id:e,"class":x+"-title","aria-atomic":i})).insertBefore(I.content).delegate(".qtip-close","mousedown keydown mouseup keyup mouseout",function(e){r(this).toggleClass("ui-state-active ui-state-focus",e.type.substr(-4)==="down")}).delegate(".qtip-close","mouseover mouseout",function(e){r(this).toggleClass("ui-state-hover",e.type==="mouseover")}),u.content.title.button&&X()}function $(e){var t=I.button;if(!l.rendered)return s;e?X():t.remove()}function J(e,t){var i=I.title;if(!l.rendered||!e)return s;r.isFunction(e)&&(e=e.call(n,q.event,l));if(e===s||!e&&e!=="")return W(s);e.jquery&&e.length>0?i.empty().append(e.css({display:"block"})):i.html(e),t!==s&&l.rendered&&B[0].offsetWidth>0&&l.reposition(q.event)}function K(e){e&&r.isFunction(e.done)&&e.done(function(e){Q(e,null,s)})}function Q(e,t,i){function a(e){function s(t){if(t.src===b||r.inArray(t,i)!==-1)return;i.push(t),r.data(t,"imagesLoaded",{src:t.src}),n.length===i.length&&(setTimeout(e),n.unbind(".imagesLoaded"))}var t=r(this),n=t.find("img").add(t.filter("img")),i=[];if(!n.length)return e();n.bind("load.imagesLoaded error.imagesLoaded",function(e){s(e.target)}).each(function(e,t){var n=t.src,i=r.data(t,"imagesLoaded");if(i&&i.src===n||t.complete&&t.naturalWidth)s(t);else if(t.readyState||t.complete)t.src=b,t.src=n})}var o=I.content;return!l.rendered||!e?s:(r.isFunction(e)&&(e=e.call(n,q.event,l)||""),i!==s&&K(u.content.deferred),e.jquery&&e.length>0?o.empty().append(e.css({display:"block"})):o.html(e),l.rendered<0?B.queue("fx",a):(M=0,a.call(B[0],r.noop)),l)}function G(){function p(e){if(B.hasClass(F))return s;clearTimeout(l.timers.show),clearTimeout(l.timers.hide);var t=function(){l.toggle(i,e)};u.show.delay>0?l.timers.show=setTimeout(t,u.show.delay):t()}function d(e){if(B.hasClass(F)||y||M)return s;var t=r(e.relatedTarget),n=t.closest(k)[0]===B[0],i=t[0]===f.show[0];clearTimeout(l.timers.show),clearTimeout(l.timers.hide);if(this!==t[0]&&o.target==="mouse"&&n||u.hide.fixed&&/mouse(out|leave|move)/.test(e.type)&&(n||i)){try{e.preventDefault(),e.stopImmediatePropagation()}catch(a){}return}u.hide.delay>0?l.timers.hide=setTimeout(function(){l.hide(e)},u.hide.delay):l.hide(e)}function v(e){if(B.hasClass(F))return s;clearTimeout(l.timers.inactive),l.timers.inactive=setTimeout(function(){l.hide(e)},u.hide.inactive)}function m(e){l.rendered&&B[0].offsetWidth>0&&l.reposition(e)}var o=u.position,f={show:u.show.target,hide:u.hide.target,viewport:r(o.viewport),document:r(t),body:r(t.body),window:r(e)},c={show:r.trim(""+u.show.event).split(" "),hide:r.trim(""+u.hide.event).split(" ")},h=E.ie===6;B.bind("mouseenter"+j+" mouseleave"+j,function(e){var t=e.type==="mouseenter";t&&l.focus(e),B.toggleClass(O,t)}),/mouse(out|leave)/i.test(u.hide.event)&&u.hide.leave==="window"&&f.document.bind("mouseout"+j+" blur"+j,function(e){!/select|option/.test(e.target.nodeName)&&!e.relatedTarget&&l.hide(e)}),u.hide.fixed?(f.hide=f.hide.add(B),B.bind("mouseover"+j,function(){B.hasClass(F)||clearTimeout(l.timers.hide)})):/mouse(over|enter)/i.test(u.show.event)&&f.hide.bind("mouseleave"+j,function(e){clearTimeout(l.timers.show)}),(""+u.hide.event).indexOf("unfocus")>-1&&o.container.closest("html").bind("mousedown"+j+" touchstart"+j,function(e){var t=r(e.target),i=l.rendered&&!B.hasClass(F)&&B[0].offsetWidth>0,s=t.parents(k).filter(B[0]).length>0;t[0]!==n[0]&&t[0]!==B[0]&&!s&&!n.has(t[0]).length&&i&&l.hide(e)}),"number"==typeof u.hide.inactive&&(f.show.bind("qtip-"+a+"-inactive",v),r.each(w.inactiveEvents,function(e,t){f.hide.add(I.tooltip).bind(t+j+"-inactive",v)})),r.each(c.hide,function(e,t){var n=r.inArray(t,c.show),i=r(f.hide);n>-1&&i.add(f.show).length===i.length||t==="unfocus"?(f.show.bind(t+j,function(e){B[0].offsetWidth>0?d(e):p(e)}),delete c.show[n]):f.hide.bind(t+j,d)}),r.each(c.show,function(e,t){f.show.bind(t+j,p)}),"number"==typeof u.hide.distance&&f.show.add(B).bind("mousemove"+j,function(e){var t=q.origin||{},n=u.hide.distance,r=Math.abs;(r(e.pageX-t.pageX)>=n||r(e.pageY-t.pageY)>=n)&&l.hide(e)}),o.target==="mouse"&&(f.show.bind("mousemove"+j,P),o.adjust.mouse&&(u.hide.event&&(B.bind("mouseleave"+j,function(e){(e.relatedTarget||e.target)!==f.show[0]&&l.hide(e)}),I.target.bind("mouseenter"+j+" mouseleave"+j,function(e){q.onTarget=e.type==="mouseenter"})),f.document.bind("mousemove"+j,function(e){l.rendered&&q.onTarget&&!B.hasClass(F)&&B[0].offsetWidth>0&&l.reposition(e||S)}))),(o.adjust.resize||f.viewport.length)&&(r.event.special.resize?f.viewport:f.window).bind("resize"+j,m),o.adjust.scroll&&f.window.add(o.container).bind("scroll"+j,m)}function Y(){var n=[u.show.target[0],u.hide.target[0],l.rendered&&I.tooltip[0],u.position.container[0],u.position.viewport[0],u.position.container.closest("html")[0],e,t];l.rendered?r([]).pushStack(r.grep(n,function(e){return typeof e=="object"})).unbind(j):u.show.target.unbind(j+"-create")}var l=this,m=t.body,g=x+"-"+a,y=0,M=0,B=r(),j=".qtip-"+a,F="qtip-disabled",I,q;l.id=a,l.rendered=s,l.destroyed=s,l.elements=I={target:n},l.timers={img:{}},l.options=u,l.checks={},l.plugins={},l.cache=q={event:{},target:r(),disabled:s,attr:f,onTarget:s,lastClass:""},l.checks.builtin={"^id$":function(e,t,n){var o=n===i?w.nextid:n,u=x+"-"+o;o!==s&&o.length>0&&!r("#"+u).length&&(B[0].id=u,I.content[0].id=u+"-content",I.title[0].id=u+"-title")},"^content.text$":function(e,t,n){Q(u.content.text)},"^content.deferred$":function(e,t,n){K(u.content.deferred)},"^content.title.text$":function(e,t,n){if(!n)return W();!I.title&&n&&V(),J(n)},"^content.title.button$":function(e,t,n){$(n)},"^position.(my|at)$":function(e,t,n){"string"==typeof n&&(e[t]=new E.Corner(n))},"^position.container$":function(e,t,n){l.rendered&&B.appendTo(n)},"^show.ready$":function(){l.rendered?l.toggle(i):l.render(1)},"^style.classes$":function(e,t,n){B.attr("class",x+" qtip "+n)},"^style.width|height":function(e,t,n){B.css(t,n)},"^style.widget|content.title":z,"^events.(render|show|move|hide|focus|blur)$":function(e,t,n){B[(r.isFunction(n)?"":"un")+"bind"]("tooltip"+t,n)},"^(show|hide|position).(event|target|fixed|inactive|leave|distance|viewport|adjust)":function(){var e=u.position;B.attr("tracking",e.target==="mouse"&&e.adjust.mouse),Y(),G()}},r.extend(l,{_triggerEvent:function(e,t,n){var i=r.Event("tooltip"+e);return i.originalEvent=(n?r.extend({},n):o)||q.event||o,B.trigger(i,[l].concat(t||[])),!i.isDefaultPrevented()},render:function(e){if(l.rendered)return l;var t=u.content.text,o=u.content.title,a=u.position;return r.attr(n[0],"aria-describedby",g),B=I.tooltip=r("<div/>",{id:g,"class":[x,L,u.style.classes,x+"-pos-"+u.position.my.abbrev()].join(" "),width:u.style.width||"",height:u.style.height||"",tracking:a.target==="mouse"&&a.adjust.mouse,role:"alert","aria-live":"polite","aria-atomic":s,"aria-describedby":g+"-content","aria-hidden":i}).toggleClass(F,q.disabled).data("qtip",l).appendTo(u.position.container).append(I.content=r("<div />",{"class":x+"-content",id:g+"-content","aria-atomic":i})),l.rendered=-1,y=1,o.text?(V(),r.isFunction(o.text)||J(o.text,s)):o.button&&X(),(!r.isFunction(t)||t.then)&&Q(t,s),l.rendered=i,z(),r.each(u.events,function(e,t){r.isFunction(t)&&B.bind(e==="toggle"?"tooltipshow tooltiphide":"tooltip"+e,t)}),r.each(E,function(){this.initialize==="render"&&this(l)}),G(),B.queue("fx",function(t){l._triggerEvent("render"),y=0,(u.show.ready||e)&&l.toggle(i,q.event,s),t()}),l},get:function(e){var t,n;switch(e.toLowerCase()){case"dimensions":t={height:B.outerHeight(s),width:B.outerWidth(s)};break;case"offset":t=E.offset(B,u.position.container);break;default:n=R(e.toLowerCase()),t=n[0][n[1]],t=t.precedance?t.string():t}return t},set:function(e,t){function p(e,t){var n,r,i;for(n in c)for(r in c[n])if(i=(new RegExp(r,"i")).exec(e))t.push(i),c[n][r].apply(l,t)}var n=/^position\.(my|at|adjust|target|container)|style|content|show\.ready/i,a=/^content\.(title|attr)|style/i,f=s,c=l.checks,h;return"string"==typeof e?(h=e,e={},e[h]=t):e=r.extend(i,{},e),r.each(e,function(t,i){var s=R(t.toLowerCase()),o;o=s[0][s[1]],s[0][s[1]]="object"==typeof i&&i.nodeType?r(i):i,e[t]=[s[0],s[1],i,o],f=n.test(t)||f}),H(u),y=1,r.each(e,p),y=0,l.rendered&&B[0].offsetWidth>0&&f&&l.reposition(u.position.target==="mouse"?o:q.event),l},toggle:function(e,n){function w(){e?(E.ie&&B[0].style.removeAttribute("filter"),B.css("overflow",""),"string"==typeof f.autofocus&&r(f.autofocus,B).focus(),f.target.trigger("qtip-"+a+"-inactive")):B.css({display:"",visibility:"",opacity:"",left:"",top:""}),l._triggerEvent(e?"visible":"hidden")}if(n){if(/over|enter/.test(n.type)&&/out|leave/.test(q.event.type)&&u.show.target.add(n.target).length===u.show.target.length&&B.has(n.relatedTarget).length)return l;q.event=r.extend({},n)}if(!l.rendered)return e?l.render(1):l;var o=e?"show":"hide",f=u[o],c=u[e?"hide":"show"],h=u.position,p=u.content,d=B.css("width"),v=B[0].offsetWidth>0,m=e||f.target.length===1,g=!n||f.target.length<2||q.target[0]===n.target,y,b;return(typeof e).search("boolean|number")&&(e=!v),!B.is(":animated")&&v===e&&g?l:l._triggerEvent(o,[90])?(r.attr(B[0],"aria-hidden",!e),e?(q.origin=r.extend({},S),l.focus(n),r.isFunction(p.text)&&Q(p.text,s),r.isFunction(p.title.text)&&J(p.title.text,s),!D&&h.target==="mouse"&&h.adjust.mouse&&(r(t).bind("mousemove.qtip",P),D=i),d||B.css("width",B.outerWidth()),l.reposition(n,arguments[2]),d||B.css("width",""),!f.solo||(typeof f.solo=="string"?r(f.solo):r(k,f.solo)).not(B).not(f.target).qtip("hide",r.Event("tooltipsolo"))):(clearTimeout(l.timers.show),delete q.origin,D&&!r(k+'[tracking="true"]:visible',f.solo).not(B).length&&(r(t).unbind("mousemove.qtip"),D=s),l.blur(n)),f.effect===s||m===s?(B[o](),w.call(B)):r.isFunction(f.effect)?(B.stop(1,1),f.effect.call(B,l),B.queue("fx",function(e){w(),e()})):B.fadeTo(90,e?1:0,w),e&&f.target.trigger("qtip-"+a+"-inactive"),l):l},show:function(e){return l.toggle(i,e)},hide:function(e){return l.toggle(s,e)},focus:function(e){if(!l.rendered)return l;var t=r(k),n=parseInt(B[0].style.zIndex,10),i=w.zindex+t.length,s=r.extend({},e),o;return B.hasClass(A)||l._triggerEvent("focus",[i],s)&&(n!==i&&(t.each(function(){this.style.zIndex>n&&(this.style.zIndex=this.style.zIndex-1)}),t.filter("."+A).qtip("blur",s)),B.addClass(A)[0].style.zIndex=i),l},blur:function(e){return B.removeClass(A),l._triggerEvent("blur",[B.css("zIndex")],e),l},reposition:function(n,i){if(!l.rendered||y)return l;y=1;var o=u.position.target,a=u.position,f=a.my,m=a.at,g=a.adjust,b=g.method.split(" "),w=B.outerWidth(s),x=B.outerHeight(s),T=0,N=0,C=B.css("position"),k=a.viewport,L={left:0,top:0},A=a.container,O=B[0].offsetWidth>0,M=n&&n.type==="scroll",_=r(e),D,P;if(r.isArray(o)&&o.length===2)m={x:h,y:c},L={left:o[0],top:o[1]};else if(o==="mouse"&&(n&&n.pageX||q.event.pageX))m={x:h,y:c},n=S&&S.pageX&&(g.mouse||!n||!n.pageX)?{pageX:S.pageX,pageY:S.pageY}:(!n||n.type!=="resize"&&n.type!=="scroll"?n&&n.pageX&&n.type==="mousemove"?n:(!g.mouse||u.show.distance)&&q.origin&&q.origin.pageX?q.origin:n:q.event)||n||q.event||S||{},C!=="static"&&(L=A.offset()),L={left:n.pageX-L.left,top:n.pageY-L.top},g.mouse&&M&&(L.left-=S.scrollX-_.scrollLeft(),L.top-=S.scrollY-_.scrollTop());else{o==="event"&&n&&n.target&&n.type!=="scroll"&&n.type!=="resize"?q.target=r(n.target):o!=="event"&&(q.target=r(o.jquery?o:I.target)),o=q.target,o=r(o).eq(0);if(o.length===0)return l;o[0]===t||o[0]===e?(T=E.iOS?e.innerWidth:o.width(),N=E.iOS?e.innerHeight:o.height(),o[0]===e&&(L={top:(k||o).scrollTop(),left:(k||o).scrollLeft()})):E.imagemap&&o.is("area")?D=E.imagemap(l,o,m,E.viewport?b:s):E.svg&&o[0].ownerSVGElement?D=E.svg(l,o,m,E.viewport?b:s):(T=o.outerWidth(s),N=o.outerHeight(s),L=E.offset(o,A)),D&&(T=D.width,N=D.height,P=D.offset,L=D.position);if(E.iOS>3.1&&E.iOS<4.1||E.iOS>=4.3&&E.iOS<4.33||!E.iOS&&C==="fixed")L.left-=_.scrollLeft(),L.top-=_.scrollTop();L.left+=m.x===d?T:m.x===v?T/2:0,L.top+=m.y===p?N:m.y===v?N/2:0}return L.left+=g.x+(f.x===d?-w:f.x===v?-w/2:0),L.top+=g.y+(f.y===p?-x:f.y===v?-x/2:0),E.viewport?(L.adjusted=E.viewport(l,L,a,T,N,w,x),P&&L.adjusted.left&&(L.left+=P.left),P&&L.adjusted.top&&(L.top+=P.top)):L.adjusted={left:0,top:0},l._triggerEvent("move",[L,k.elem||k],n)?(delete L.adjusted,i===s||!O||isNaN(L.left)||isNaN(L.top)||o==="mouse"||!r.isFunction(a.effect)?B.css(L):r.isFunction(a.effect)&&(a.effect.call(B,l,r.extend({},L)),B.queue(function(e){r(this).css({opacity:"",height:""}),E.ie&&this.style.removeAttribute("filter"),e()})),y=0,l):l},disable:function(e){return"boolean"!=typeof e&&(e=!B.hasClass(F)&&!q.disabled),l.rendered?(B.toggleClass(F,e),r.attr(B[0],"aria-disabled",e)):q.disabled=!!e,l},enable:function(){return l.disable(s)},destroy:function(e){function t(){var e=n[0],t=r.attr(e,_),i=n.data("qtip");l.rendered&&(r.each(l.plugins,function(e){this.destroy&&this.destroy(),delete l.plugins[e]}),B.stop(1,0).find("*").remove().end().remove(),l.rendered=s),clearTimeout(l.timers.show),clearTimeout(l.timers.hide),Y();if(!i||l===i)n.removeData("qtip").removeAttr(T),u.suppress&&t&&(n.attr("title",t),n.removeAttr(_)),n.removeAttr("aria-describedby");n.unbind(".qtip-"+a),delete N[l.id],delete l.options,delete l.elements,delete l.cache,delete l.timers,delete l.checks}if(l.destroyed)return;return l.destroyed=i,e===i?t():(B.bind("tooltiphidden",t),l.hide()),n}})}function j(e,n,u){var a,f,l,c,h,p=r(t.body),d=e[0]===t?p:e,v=e.metadata?e.metadata(u.metadata):o,m=u.metadata.type==="html5"&&v?v[u.metadata.name]:o,g=e.data(u.metadata.name||"qtipopts");try{g=typeof g=="string"?r.parseJSON(g):g}catch(y){}c=r.extend(i,{},w.defaults,u,typeof g=="object"?H(g):o,H(m||v)),f=c.position,c.id=n;if("boolean"==typeof c.content.text){l=e.attr(c.content.attr);if(c.content.attr===s||!l)return s;c.content.text=l}f.container.length||(f.container=p),f.target===s&&(f.target=d),c.show.target===s&&(c.show.target=d),c.show.solo===i&&(c.show.solo=f.container.closest("body")),c.hide.target===s&&(c.hide.target=d),c.position.viewport===i&&(c.position.viewport=f.container),f.container=f.container.eq(0),f.at=new E.Corner(f.at),f.my=new E.Corner(f.my);if(e.data("qtip"))if(c.overwrite)e.qtip("destroy");else if(c.overwrite===s)return s;return e.attr(T,!0),c.suppress&&(h=e.attr("title"))&&e.removeAttr("title").attr(_,h).attr("title",""),a=new B(e,c,n,!!l),e.data("qtip",a),e.one("remove.qtip-"+n+" removeqtip.qtip-"+n,function(){var e;(e=r(this).data("qtip"))&&e.destroy()}),a}function R(e){var t=this,n=e.elements.tooltip,o=e.options.content.ajax,u=w.defaults.content.ajax,a=i,f=s,l;e.checks.ajax={"^content.ajax":function(e,r,i){r==="ajax"&&(o=i),r==="once"?t.init():o&&o.url?t.load():n.unbind(I)}},r.extend(t,{init:function(){return o&&o.url&&n.unbind(I)[o.once?"one":"bind"]("tooltipshow"+I,t.load),t},load:function(n){function m(){var t;if(e.destroyed)return;a=s,d&&(f=i,e.show(n.originalEvent)),(t=u.complete||o.complete)&&r.isFunction(t)&&t.apply(o.context||e,arguments)}function g(t,n,i){var s;if(e.destroyed)return;p&&"string"==typeof t&&(t=r("<div/>").append(t.replace(q,"")).find(p)),(s=u.success||o.success)&&r.isFunction(s)?s.call(o.context||e,t,n,i):e.set("content.text",t)}function y(t,n,r){if(e.destroyed||t.status===0)return;e.set("content.text",n+": "+r)}if(f){f=s;return}var c=o.url.lastIndexOf(" "),h=o.url,p,d=!o.loading&&a;if(d)try{n.preventDefault()}catch(v){}else if(n&&n.isDefaultPrevented())return t;l&&l.abort&&l.abort(),c>-1&&(p=h.substr(c),h=h.substr(0,c)),l=r.ajax(r.extend({error:u.error||y,context:e},o,{url:h,success:g,complete:m}))},destroy:function(){l&&l.abort&&l.abort(),e.destroyed=i}}),t.init()}function X(e,t,n){var r=Math.ceil(t/2),i=Math.ceil(n/2),s={bottomright:[[0,0],[t,n],[t,0]],bottomleft:[[0,0],[t,0],[0,n]],topright:[[0,n],[t,0],[t,n]],topleft:[[0,0],[0,n],[t,n]],topcenter:[[0,n],[r,0],[t,n]],bottomcenter:[[0,0],[t,0],[r,n]],rightcenter:[[0,0],[t,i],[0,n]],leftcenter:[[t,0],[t,n],[0,i]]};return s.lefttop=s.bottomright,s.righttop=s.bottomleft,s.leftbottom=s.topright,s.rightbottom=s.topleft,s[e.string()]}function V(e,t){function k(e){var t=w.is(":visible");w.show(),e(),w.toggle(t)}function L(){x.width=g.height,x.height=g.width}function A(){x.width=g.width,x.height=g.height}function O(t,r,o,f){if(!b.tip)return;var l=m.corner.clone(),w=o.adjusted,E=e.options.position.adjust.method.split(" "),x=E[0],T=E[1]||E[0],N={left:s,top:s,x:0,y:0},C,k={},L;m.corner.fixed!==i&&(x===y&&l.precedance===u&&w.left&&l.y!==v?l.precedance=l.precedance===u?a:u:x!==y&&w.left&&(l.x=l.x===v?w.left>0?h:d:l.x===h?d:h),T===y&&l.precedance===a&&w.top&&l.x!==v?l.precedance=l.precedance===a?u:a:T!==y&&w.top&&(l.y=l.y===v?w.top>0?c:p:l.y===c?p:c),l.string()!==S.corner.string()&&(S.top!==w.top||S.left!==w.left)&&m.update(l,s)),C=m.position(l,w),C[l.x]+=_(l,l.x),C[l.y]+=_(l,l.y),C.right!==n&&(C.left=-C.right),C.bottom!==n&&(C.top=-C.bottom),C.user=Math.max(0,g.offset);if(N.left=x===y&&!!w.left)l.x===v?k["margin-left"]=N.x=C["margin-left"]-w.left:(L=C.right!==n?[w.left,-C.left]:[-w.left,C.left],(N.x=Math.max(L[0],L[1]))>L[0]&&(o.left-=w.left,N.left=s),k[C.right!==n?d:h]=N.x);if(N.top=T===y&&!!w.top)l.y===v?k["margin-top"]=N.y=C["margin-top"]-w.top:(L=C.bottom!==n?[w.top,-C.top]:[-w.top,C.top],(N.y=Math.max(L[0],L[1]))>L[0]&&(o.top-=w.top,N.top=s),k[C.bottom!==n?p:c]=N.y);b.tip.css(k).toggle(!(N.x&&N.y||l.x===v&&N.y||l.y===v&&N.x)),o.left-=C.left.charAt?C.user:x!==y||N.top||!N.left&&!N.top?C.left:0,o.top-=C.top.charAt?C.user:T!==y||N.left||!N.left&&!N.top?C.top:0,S.left=w.left,S.top=w.top,S.corner=l.clone()}function M(){var t=g.corner,n=e.options.position,r=n.at,o=n.my.string?n.my.string():n.my;return t===s||o===s&&r===s?s:(t===i?m.corner=new E.Corner(o):t.string||(m.corner=new E.Corner(t),m.corner.fixed=i),S.corner=new E.Corner(m.corner.string()),m.corner.string()!=="centercenter")}function _(e,t,n){t=t?t:e[e.precedance];var r=b.titlebar&&e.y===c,i=r?b.titlebar:w,s="border-"+t+"-width",o=function(e){return parseInt(e.css(s),10)},u;return k(function(){u=(n?o(n):o(b.content)||o(i)||o(w))||0}),u}function D(e){var t=b.titlebar&&e.y===c,n=t?b.titlebar:b.content,r="-moz-",i="-webkit-",s="border-radius-"+e.y+e.x,o="border-"+e.y+"-"+e.x+"-radius",u=function(e){return parseInt(n.css(e),10)||parseInt(w.css(e),10)},a;return k(function(){a=u(o)||u(s)||u(r+o)||u(r+s)||u(i+o)||u(i+s)||0}),a}function P(e){function N(e,t,n){var r=e.css(t)||p;return n&&r===e.css(n)?s:f.test(r)?s:r}var t,n,o,u=b.tip.css("cssText",""),a=e||m.corner,f=/rgba?\(0, 0, 0(, 0)?\)|transparent|#123456/i,l="border-"+a[a.precedance]+"-color",h="background-color",p="transparent",d=" !important",y=b.titlebar,E=y&&(a.y===c||a.y===v&&u.position().top+x.height/2+g.offset<y.outerHeight(i)),S=E?y:b.content;k(function(){T.fill=N(u,h)||N(S,h)||N(b.content,h)||N(w,h)||u.css(h),T.border=N(u,l,"color")||N(S,l,"color")||N(b.content,l,"color")||N(w,l,"color")||w.css(l),r("*",u).add(u).css("cssText",h+":"+p+d+";border:0"+d+";")})}function H(e){var t=e.precedance===a,n=x[t?f:l],r=x[t?l:f],i=e.string().indexOf(v)>-1,s=n*(i?.5:1),o=Math.pow,u=Math.round,c,h,p,d=Math.sqrt(o(s,2)+o(r,2)),m=[N/s*d,N/r*d];return m[2]=Math.sqrt(o(m[0],2)-o(N,2)),m[3]=Math.sqrt(o(m[1],2)-o(N,2)),c=d+m[2]+m[3]+(i?0:m[0]),h=c/d,p=[u(h*r),u(h*n)],{height:p[t?0:1],width:p[t?1:0]}}function B(e,t,n){return"<qvml:"+e+' xmlns="urn:schemas-microsoft.com:vml" class="qtip-vml" '+(t||"")+' style="behavior: url(#default#VML); '+(n||"")+'" />'}var m=this,g=e.options.style.tip,b=e.elements,w=b.tooltip,S={top:0,left:0},x={width:g.width,height:g.height},T={},N=g.border||0,C;m.corner=o,m.mimic=o,m.border=N,m.offset=g.offset,m.size=x,e.checks.tip={"^position.my|style.tip.(corner|mimic|border)$":function(){m.init()||m.destroy(),e.reposition()},"^style.tip.(height|width)$":function(){x={width:g.width,height:g.height},m.create(),m.update(),e.reposition()},"^content.title.text|style.(classes|widget)$":function(){b.tip&&b.tip.length&&m.update()}},r.extend(m,{init:function(){var e=M()&&(W||E.ie);return e&&(m.create(),m.update(),w.unbind(z).bind("tooltipmove"+z,O)),e},create:function(){var e=x.width,t=x.height,n;b.tip&&b.tip.remove(),b.tip=r("<div />",{"class":"qtip-tip"}).css({width:e,height:t}).prependTo(w),W?r("<canvas />").appendTo(b.tip)[0].getContext("2d").save():(n=B("shape",'coordorigin="0,0"',"position:absolute;"),b.tip.html(n+n),r("*",b.tip).bind("click"+z+" mousedown"+z,function(e){e.stopPropagation()}))},update:function(e,t){var n=b.tip,f=n.children(),l=x.width,y=x.height,C=g.mimic,k=Math.round,O,M,D,j,F;e||(e=S.corner||m.corner),C===s?C=e:(C=new E.Corner(C),C.precedance=e.precedance,C.x==="inherit"?C.x=e.x:C.y==="inherit"?C.y=e.y:C.x===C.y&&(C[e.precedance]=e[e.precedance])),O=C.precedance,e.precedance===u?L():A(),b.tip.css({width:l=x.width,height:y=x.height}),P(e),T.border!=="transparent"?(N=_(e,o),g.border===0&&N>0&&(T.fill=T.border),m.border=N=g.border!==i?g.border:N):m.border=N=0,D=X(C,l,y),m.size=F=H(e),n.css(F).css("line-height",F.height+"px"),e.precedance===a?j=[k(C.x===h?N:C.x===d?F.width-l-N:(F.width-l)/2),k(C.y===c?F.height-y:0)]:j=[k(C.x===h?F.width-l:0),k(C.y===c?N:C.y===p?F.height-y-N:(F.height-y)/2)],W?(f.attr(F),M=f[0].getContext("2d"),M.restore(),M.save(),M.clearRect(0,0,3e3,3e3),M.fillStyle=T.fill,M.strokeStyle=T.border,M.lineWidth=N*2,M.lineJoin="miter",M.miterLimit=100,M.translate(j[0],j[1]),M.beginPath(),M.moveTo(D[0][0],D[0][1]),M.lineTo(D[1][0],D[1][1]),M.lineTo(D[2][0],D[2][1]),M.closePath(),N&&(w.css("background-clip")==="border-box"&&(M.strokeStyle=T.fill,M.stroke()),M.strokeStyle=T.border,M.stroke()),M.fill()):(D="m"+D[0][0]+","+D[0][1]+" l"+D[1][0]+","+D[1][1]+" "+D[2][0]+","+D[2][1]+" xe",j[2]=N&&/^(r|b)/i.test(e.string())?E.ie===8?2:1:0,f.css({coordsize:l+N+" "+(y+N),antialias:""+(C.string().indexOf(v)>-1),left:j[0],top:j[1],width:l+N,height:y+N}).each(function(e){var t=r(this);t[t.prop?"prop":"attr"]({coordsize:l+N+" "+(y+N),path:D,fillcolor:T.fill,filled:!!e,stroked:!e}).toggle(!!N||!!e),!e&&t.html()===""&&t.html(B("stroke",'weight="'+N*2+'px" color="'+T.border+'" miterlimit="1000" joinstyle="miter"'))})),setTimeout(function(){b.tip.css({display:"inline-block",visibility:"visible"})},1),t!==s&&m.position(e)},position:function(e){var t=b.tip,n={},i=Math.max(0,g.offset),o,p,d;return g.corner===s||!t?s:(e=e||m.corner,o=e.precedance,p=H(e),d=[e.x,e.y],o===u&&d.reverse(),r.each(d,function(t,r){var s,u,d;r===v?(s=o===a?h:c,n[s]="50%",n["margin-"+s]=-Math.round(p[o===a?f:l]/2)+i):(s=_(e,r),u=_(e,r,b.content),d=D(e),n[r]=t?u:i+(d>s?d:-s))}),n[e[o]]-=p[o===u?f:l],t.css({top:"",bottom:"",left:"",right:"",margin:""}).css(n),n)},destroy:function(){w.unbind(z),b.tip&&b.tip.find("*").remove().end().remove(),delete m.corner,delete m.mimic,delete m.size}}),m.init()}function Y(e){var n=this,o=e.options.show.modal,u=e.elements,a=u.tooltip,f=G+e.id,l;e.checks.modal={"^show.modal.(on|blur)$":function(){n.destroy(),n.init(),l.toggle(a.is(":visible"))}},r.extend(n,{init:function(){return o.on?(l=u.overlay=J.elem,a.attr(K,i).css("z-index",E.modal.zindex+r(Q).length).bind("tooltipshow"+f+" tooltiphide"+f,function(e,t,i){var s=e.originalEvent;if(e.target===a[0])if(s&&e.type==="tooltiphide"&&/mouse(leave|enter)/.test(s.type)&&r(s.relatedTarget).closest(l[0]).length)try{e.preventDefault()}catch(o){}else(!s||s&&!s.solo)&&n.toggle(e,e.type==="tooltipshow",i)}).bind("tooltipfocus"+f,function(e,t){if(e.isDefaultPrevented()||e.target!==a[0])return;var n=r(Q),i=E.modal.zindex+n.length,s=parseInt(a[0].style.zIndex,10);l[0].style.zIndex=i-1,n.each(function(){this.style.zIndex>s&&(this.style.zIndex-=1)}),n.filter("."+A).qtip("blur",e.originalEvent),a.addClass(A)[0].style.zIndex=i,J.update(t);try{e.preventDefault()}catch(o){}}).bind("tooltiphide"+f,function(e){e.target===a[0]&&r(Q).filter(":visible").not(a).last().qtip("focus",e)}),n):n},toggle:function(t,r,i){return t&&t.isDefaultPrevented()?n:(J.toggle(e,!!r,i),n)},destroy:function(){r([t,a]).removeAttr(K).unbind(f),J.toggle(e,s),delete u.overlay}}),n.init()}function et(n){var o=this,u=n.elements,a=n.options,c=u.tooltip,h=".ie6-"+n.id,p=r("select, object").length<1,d=0,v=s,m;n.checks.ie6={"^content|style$":function(e,t,n){redraw()}},r.extend(o,{init:function(){var n=r(e),s;p&&(u.bgiframe=r('<iframe class="qtip-bgiframe" frameborder="0" tabindex="-1" src="javascript:\'\';"  style="display:block; position:absolute; z-index:-1; filter:alpha(opacity=0); -ms-filter:"progid:DXImageTransform.Microsoft.Alpha(Opacity=0)";"></iframe>'),u.bgiframe.appendTo(c),c.bind("tooltipmove"+h,o.adjustBGIFrame)),m=r("<div/>",{id:"qtip-rcontainer"}).appendTo(t.body),o.redraw(),u.overlay&&!v&&(s=function(){u.overlay[0].style.top=n.scrollTop()+"px"},n.bind("scroll.qtip-ie6, resize.qtip-ie6",s),s(),u.overlay.addClass("qtipmodal-ie6fix"),v=i)},adjustBGIFrame:function(){var e=n.get("dimensions"),t=n.plugins.tip,r=u.tip,i,s;s=parseInt(c.css("border-left-width"),10)||0,s={left:-s,top:-s},t&&r&&(i=t.corner.precedance==="x"?["width","left"]:["height","top"],s[i[1]]-=r[i[0]]()),u.bgiframe.css(s).css(e)},redraw:function(){if(n.rendered<1||d)return o;var e=a.style,t=a.position.container,r,i,s,u;return d=1,e.height&&c.css(l,e.height),e.width?c.css(f,e.width):(c.css(f,"").appendTo(m),i=c.width(),i%2<1&&(i+=1),s=c.css("max-width")||"",u=c.css("min-width")||"",r=(s+u).indexOf("%")>-1?t.width()/100:0,s=(s.indexOf("%")>-1?r:1)*parseInt(s,10)||i,u=(u.indexOf("%")>-1?r:1)*parseInt(u,10)||0,i=s+u?Math.min(Math.max(i,u),s):i,c.css(f,Math.round(i)).appendTo(t)),d=0,o},destroy:function(){p&&u.bgiframe.remove(),c.unbind(h)}}),o.init()}var i=!0,s=!1,o=null,u="x",a="y",f="width",l="height",c="top",h="left",p="bottom",d="right",v="center",m="flip",g="flipinvert",y="shift",b="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==",w,E,S,x="qtip",T="data-hasqtip",N={},C=["ui-widget","ui-tooltip"],k="div.qtip."+x,L=x+"-default",A=x+"-focus",O=x+"-hover",M="_replacedByqTip",_="oldtitle",D;w=r.fn.qtip=function(e,t,u){var a=(""+e).toLowerCase(),f=o,l=r.makeArray(arguments).slice(1),c=l[l.length-1],h=this[0]?r.data(this[0],"qtip"):o;if(!arguments.length&&h||a==="api")return h;if("string"==typeof e)return this.each(function(){var e=r.data(this,"qtip");if(!e)return i;c&&c.timeStamp&&(e.cache.event=c);if(a!=="option"&&a!=="options"||!t)e[a]&&e[a].apply(e[a],l);else{if(!r.isPlainObject(t)&&u===n)return f=e.get(t),s;e.set(t,u)}}),f!==o?f:this;if("object"==typeof e||!arguments.length)return h=H(r.extend(i,{},e)),w.bind.call(this,h,c)},w.bind=function(e,t){return this.each(function(o){function p(e){function t(){c.render(typeof e=="object"||u.show.ready),a.show.add(a.hide).unbind(l)}if(c.cache.disabled)return s;c.cache.event=r.extend({},e),c.cache.target=e?r(e.target):[n],u.show.delay>0?(clearTimeout(c.timers.show),c.timers.show=setTimeout(t,u.show.delay),f.show!==f.hide&&a.hide.bind(f.hide,function(){clearTimeout(c.timers.show)})):t()}var u,a,f,l,c,h;h=r.isArray(e.id)?e.id[o]:e.id,h=!h||h===s||h.length<1||N[h]?w.nextid++:N[h]=h,l=".qtip-"+h+"-create",c=j(r(this),h,e);if(c===s)return i;u=c.options,r.each(E,function(){this.initialize==="initialize"&&this(c)}),a={show:u.show.target,hide:u.hide.target},f={show:r.trim(""+u.show.event).replace(/ /g,l+" ")+l,hide:r.trim(""+u.hide.event).replace(/ /g,l+" ")+l},/mouse(over|enter)/i.test(f.show)&&!/mouse(out|leave)/i.test(f.hide)&&(f.hide+=" mouseleave"+l),a.show.bind("mousemove"+l,function(e){P(e),c.cache.onTarget=i}),a.show.bind(f.show,p),(u.show.ready||u.prerender)&&p(t)})},E=w.plugins={Corner:function(e){e=(""+e).replace(/([A-Z])/," $1").replace(/middle/gi,v).toLowerCase(),this.x=(e.match(/left|right/i)||e.match(/center/)||["inherit"])[0].toLowerCase(),this.y=(e.match(/top|bottom|center/i)||["inherit"])[0].toLowerCase();var t=e.charAt(0);this.precedance=t==="t"||t==="b"?a:u,this.string=function(){return this.precedance===a?this.y+this.x:this.x+this.y},this.abbrev=function(){var e=this.x.substr(0,1),t=this.y.substr(0,1);return e===t?e:this.precedance===a?t+e:e+t},this.invertx=function(e){this.x=this.x===h?d:this.x===d?h:e||this.x},this.inverty=function(e){this.y=this.y===c?p:this.y===p?c:e||this.y},this.clone=function(){return{x:this.x,y:this.y,precedance:this.precedance,string:this.string,abbrev:this.abbrev,clone:this.clone,invertx:this.invertx,inverty:this.inverty}}},offset:function(e,n){function c(e,t){i.left+=t*e.scrollLeft(),i.top+=t*e.scrollTop()}var i=e.offset(),s=e.closest("body"),o=E.ie&&t.compatMode!=="CSS1Compat",u=n,a,f,l;if(u){do u.css("position")!=="static"&&(f=u.position(),i.left-=f.left+(parseInt(u.css("borderLeftWidth"),10)||0)+(parseInt(u.css("marginLeft"),10)||0),i.top-=f.top+(parseInt(u.css("borderTopWidth"),10)||0)+(parseInt(u.css("marginTop"),10)||0),!a&&(l=u.css("overflow"))!=="hidden"&&l!=="visible"&&(a=u));while((u=r(u[0].offsetParent)).length);(a&&a[0]!==s[0]||o)&&c(a||s,1)}return i},ie:function(){var e=3,n=t.createElement("div");while(n.innerHTML="<!--[if gt IE "+ ++e+"]><i></i><![endif]-->")if(!n.getElementsByTagName("i")[0])break;return e>4?e:s}(),iOS:parseFloat((""+(/CPU.*OS ([0-9_]{1,5})|(CPU like).*AppleWebKit.*Mobile/i.exec(navigator.userAgent)||[0,""])[1]).replace("undefined","3_2").replace("_",".").replace("_",""))||s,fn:{attr:function(e,t){if(this.length){var n=this[0],i="title",s=r.data(n,"qtip");if(e===i&&s&&"object"==typeof s&&s.options.suppress)return arguments.length<2?r.attr(n,_):(s&&s.options.content.attr===i&&s.cache.attr&&s.set("content.text",t),this.attr(_,t))}return r.fn["attr"+M].apply(this,arguments)},clone:function(e){var t=r([]),n="title",i=r.fn["clone"+M].apply(this,arguments);return e||i.filter("["+_+"]").attr("title",function(){return r.attr(this,_)}).removeAttr(_),i}}},r.each(E.fn,function(e,t){if(!t||r.fn[e+M])return i;var n=r.fn[e+M]=r.fn[e];r.fn[e]=function(){return t.apply(this,arguments)||n.apply(this,arguments)}}),r.ui||(r["cleanData"+M]=r.cleanData,r.cleanData=function(e){for(var t=0,i;(i=e[t])!==n&&i.getAttribute(T);t++)try{r(i).triggerHandler("removeqtip")}catch(s){}r["cleanData"+M](e)}),w.version="2.0.1-28-",w.nextid=0,w.inactiveEvents="click dblclick mousedown mouseup mousemove mouseleave mouseenter".split(" "),w.zindex=15e3,w.defaults={prerender:s,id:s,overwrite:i,suppress:i,content:{text:i,attr:"title",deferred:s,title:{text:s,button:s}},position:{my:"top left",at:"bottom right",target:s,container:s,viewport:s,adjust:{x:0,y:0,mouse:i,scroll:i,resize:i,method:"flipinvert flipinvert"},effect:function(e,t,n){r(this).animate(t,{duration:200,queue:s})}},show:{target:s,event:"mouseenter",effect:i,delay:90,solo:s,ready:s,autofocus:s},hide:{target:s,event:"mouseleave",effect:i,delay:0,fixed:s,inactive:s,leave:"window",distance:s},style:{classes:"",widget:s,width:s,height:s,def:i},events:{render:o,move:o,show:o,hide:o,toggle:o,visible:o,hidden:o,focus:o,blur:o}},E.svg=function(e,n,i,s){var o=r(t),u=n[0],a={width:0,height:0,position:{top:1e10,left:1e10}},f,l,c,h,p;while(!u.getBBox)u=u.parentNode;if(u.getBBox&&u.parentNode){f=u.getBBox(),l=u.getScreenCTM(),c=u.farthestViewportElement||u;if(!c.createSVGPoint)return a;h=c.createSVGPoint(),h.x=f.x,h.y=f.y,p=h.matrixTransform(l),a.position.left=p.x,a.position.top=p.y,h.x+=f.width,h.y+=f.height,p=h.matrixTransform(l),a.width=p.x-a.position.left,a.height=p.y-a.position.top,a.position.left+=o.scrollLeft(),a.position.top+=o.scrollTop()}return a};var F,I=".qtip-ajax",q=/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;F=E.ajax=function(e){var t=e.plugins.ajax;return"object"==typeof t?t:e.plugins.ajax=new R(e)},F.initialize="render",F.sanitize=function(e){var t=e.content,n;t&&"ajax"in t&&(n=t.ajax,typeof n!="object"&&(n=e.content.ajax={url:n}),"boolean"!=typeof n.once&&n.once&&(n.once=!!n.once))},r.extend(i,w.defaults,{content:{ajax:{loading:i,once:i}}});var U,z=".qtip-tip",W=!!t.createElement("canvas").getContext;U=E.tip=function(e){var t=e.plugins.tip;return"object"==typeof t?t:e.plugins.tip=new V(e)},U.initialize="render",U.sanitize=function(e){var t=e.style,n;t&&"tip"in t&&(n=e.style.tip,typeof n!="object"&&(e.style.tip={corner:n}),/string|boolean/i.test(typeof n.corner)||(n.corner=i),typeof n.width!="number"&&delete n.width,typeof n.height!="number"&&delete n.height,typeof n.border!="number"&&n.border!==i&&delete n.border,typeof n.offset!="number"&&delete n.offset)},r.extend(i,w.defaults,{style:{tip:{corner:i,mimic:s,width:12,height:6,border:i,offset:0}}});var $,J,K="is-modal-qtip",Q=k+"["+K+"]",G=".qtipmodal";J=function(){function h(e){if(r.expr[":"].focusable)return r.expr[":"].focusable;var t=!isNaN(r.attr(e,"tabindex")),n=e.nodeName.toLowerCase(),i,s,o;return"area"===n?(i=e.parentNode,s=i.name,!e.href||!s||i.nodeName.toLowerCase()!=="map"?!1:(o=r("img[usemap=#"+s+"]")[0],!!o&&o.is(":visible"))):/input|select|textarea|button|object/.test(n)?!e.disabled:"a"===n?e.href||t:t}function p(e){u.length<1&&e.length?e.not("body").blur():u.first().focus()}function d(e){if(!c.is(":visible"))return;var t=r(e.target),n=a.elements.tooltip,i=t.closest(k),o;o=i.length<1?s:parseInt(i[0].style.zIndex,10)>parseInt(n[0].style.zIndex,10),!o&&t.closest(k)[0]!==n[0]&&p(t),f=e.target===u[u.length-1]}var n=this,u={},a,f,l,c;r.extend(n,{init:function(){function i(){var e=r(this);c.css({height:e.height(),width:e.width()})}return c=n.elem=r("<div />",{id:"qtip-overlay",html:"<div></div>",mousedown:function(){return s}}).hide(),r(e).bind("resize"+G,i),i(),r(t.body).bind("focusin"+G,d),r(t).bind("keydown"+G,function(e){a&&a.options.show.modal.escape&&e.keyCode===27&&a.hide(e)}),c.bind("click"+G,function(e){a&&a.options.show.modal.blur&&a.hide(e)}),n},update:function(e){a=e,e.options.show.modal.stealfocus!==s?u=e.elements.tooltip.find("*").filter(function(){return h(this)}):u=[]},toggle:function(e,u,f){var h=r(t.body),d=e.elements.tooltip,v=e.options.show.modal,m=v.effect,g=u?"show":"hide",y=c.is(":visible"),b=r(Q).filter(":visible:not(:animated)").not(d),w;return n.update(e),u&&v.stealfocus!==s&&p(r(":focus")),c.toggleClass("blurs",v.blur),u&&c.css({left:0,top:0}).appendTo(t.body),c.is(":animated")&&y===u&&l!==s||!u&&b.length?n:(c.stop(i,s),r.isFunction(m)?m.call(c,u):m===s?c[g]():c.fadeTo(parseInt(f,10)||90,u?1:0,function(){u||c.hide()}),u||c.queue(function(e){c.css({left:"",top:""}),b.length||c.detach(),e()}),l=u,a.destroyed&&(a=o),n)}}),n.init()},J=new J,$=E.modal=function(e){var t=e.plugins.modal;return"object"==typeof t?t:e.plugins.modal=new Y(e)},$.sanitize=function(e){e.show&&(typeof e.show.modal!="object"?e.show.modal={on:!!e.show.modal}:typeof e.show.modal.on=="undefined"&&(e.show.modal.on=i))},$.zindex=w.zindex-200,$.initialize="render",r.extend(i,w.defaults,{show:{modal:{on:s,effect:i,blur:i,stealfocus:i,escape:i}}}),E.viewport=function(n,r,i,s,o,m,b){function j(e,t,n,i,s,o,u,a,f){var l=r[s],c=S[e],h=T[e],p=n===y,d=-O.offset[s]+A.offset[s]+A["scroll"+s],m=c===s?f:c===o?-f:-f/2,b=h===s?a:h===o?-a:-a/2,w=_&&_.size?_.size[u]||0:0,E=_&&_.corner&&_.corner.precedance===e&&!p?w:0,x=d-l+E,N=l+f-A[u]-d+E,C=m-(S.precedance===e||c===S[t]?b:0)-(h===v?a/2:0);return p?(E=_&&_.corner&&_.corner.precedance===t?w:0,C=(c===s?1:-1)*m-E,r[s]+=x>0?x:N>0?-N:0,r[s]=Math.max(-O.offset[s]+A.offset[s]+(E&&_.corner[e]===v?_.offset:0),l-C,Math.min(Math.max(-O.offset[s]+A.offset[s]+A[u],l+C),r[s]))):(i*=n===g?2:0,x>0&&(c!==s||N>0)?(r[s]-=C+i,H["invert"+e](s)):N>0&&(c!==o||x>0)&&(r[s]-=(c===v?-C:C)+i,H["invert"+e](o)),r[s]<d&&-r[s]>N&&(r[s]=l,H=S.clone())),r[s]-l}var w=i.target,E=n.elements.tooltip,S=i.my,T=i.at,N=i.adjust,C=N.method.split(" "),k=C[0],L=C[1]||C[0],A=i.viewport,O=i.container,M=n.cache,_=n.plugins.tip,D={left:0,top:0},P,H,B;if(!A.jquery||w[0]===e||w[0]===t.body||N.method==="none")return D;P=E.css("position")==="fixed",A={elem:A,height:A[(A[0]===e?"h":"outerH")+"eight"](),width:A[(A[0]===e?"w":"outerW")+"idth"](),scrollleft:P?0:A.scrollLeft(),scrolltop:P?0:A.scrollTop(),offset:A.offset()||{left:0,top:0}},O={elem:O,scrollLeft:O.scrollLeft(),scrollTop:O.scrollTop(),offset:O.offset()||{left:0,top:0}};if(k!=="shift"||L!=="shift")H=S.clone();return D={left:k!=="none"?j(u,a,k,N.x,h,d,f,s,m):0,top:L!=="none"?j(a,u,L,N.y,c,p,l,o,b):0},H&&M.lastClass!==(B=x+"-pos-"+H.abbrev())&&E.removeClass(n.cache.lastClass).addClass(n.cache.lastClass=B),D},E.imagemap=function(e,t,n,i){function E(e,t,n){var r=0,i=1,s=1,o=0,u=0,a=e.width,f=e.height;while(a>0&&f>0&&i>0&&s>0){a=Math.floor(a/2),f=Math.floor(f/2),n.x===h?i=a:n.x===d?i=e.width-a:i+=Math.floor(a/2),n.y===c?s=f:n.y===p?s=e.height-f:s+=Math.floor(f/2),r=t.length;while(r--){if(t.length<2)break;o=t[r][0]-e.position.left,u=t[r][1]-e.position.top,(n.x===h&&o>=i||n.x===d&&o<=i||n.x===v&&(o<i||o>e.width-i)||n.y===c&&u>=s||n.y===p&&u<=s||n.y===v&&(u<s||u>e.height-s))&&t.splice(r,1)}}return{left:t[0][0],top:t[0][1]}}t.jquery||(t=r(t));var s=e.cache.areas={},o=(t[0].shape||t.attr("shape")).toLowerCase(),u=t[0].coords||t.attr("coords"),a=u.split(","),f=[],l=r('img[usemap="#'+t.parent("map").attr("name")+'"]'),m=l.offset(),g={width:0,height:0,position:{top:1e10,right:0,bottom:0,left:1e10}},y=0,b=0,w;m.left+=Math.ceil((l.outerWidth()-l.width())/2),m.top+=Math.ceil((l.outerHeight()-l.height())/2);if(o==="poly"){y=a.length;while(y--)b=[parseInt(a[--y],10),parseInt(a[y+1],10)],b[0]>g.position.right&&(g.position.right=b[0]),b[0]<g.position.left&&(g.position.left=b[0]),b[1]>g.position.bottom&&(g.position.bottom=b[1]),b[1]<g.position.top&&(g.position.top=b[1]),f.push(b)}else{y=-1;while(y++<a.length)f.push(parseInt(a[y],10))}switch(o){case"rect":g={width:Math.abs(f[2]-f[0]),height:Math.abs(f[3]-f[1]),position:{left:Math.min(f[0],f[2]),top:Math.min(f[1],f[3])}};break;case"circle":g={width:f[2]+2,height:f[2]+2,position:{left:f[0],top:f[1]}};break;case"poly":g.width=Math.abs(g.position.right-g.position.left),g.height=Math.abs(g.position.bottom-g.position.top),n.abbrev()==="c"?g.position={left:g.position.left+g.width/2,top:g.position.top+g.height/2}:(s[n+u]||(g.position=E(g,f.slice(),n),i&&(i[0]==="flip"||i[1]==="flip")&&(g.offset=E(g,f.slice(),{x:n.x===h?d:n.x===d?h:v,y:n.y===c?p:n.y===p?c:v}),g.offset.left-=g.position.left,g.offset.top-=g.position.top),s[n+u]=g),g=s[n+u]),g.width=g.height=0}return g.position.left+=m.left,g.position.top+=m.top,g};var Z;Z=E.ie6=function(e){var t=e.plugins.ie6;return E.ie!==6?s:"object"==typeof t?t:e.plugins.ie6=new et(e)},Z.initialize="render"})})(window,document);

})(njQuery);  /*
 * jQuery Foundation Joyride Plugin 2.1
 * http://foundation.zurb.com
 * Copyright 2013, ZURB
 * Free to use under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
*/

/*jslint unparam: true, browser: true, indent: 2 */

;(function ($, window, undefined) {
  'use strict';

  var defaults = {
      'version'              : '2.1',
      'tipLocation'          : 'bottom',  // 'top' or 'bottom' in relation to parent
      'nubPosition'          : 'auto',    // override on a per tooltip bases
      'scroll'               : true,      // whether to scroll to tips
      'scrollSpeed'          : 300,       // Page scrolling speed in milliseconds
      'timer'                : 0,         // 0 = no timer , all other numbers = timer in milliseconds
      'autoStart'            : false,     // true or false - false tour starts when restart called
      'startTimerOnClick'    : true,      // true or false - true requires clicking the first button start the timer
      'startOffset'          : 0,         // the index of the tooltip you want to start on (index of the li)
      'nextButton'           : true,      // true or false to control whether a next button is used
      'tipAnimation'         : 'fade',    // 'pop' or 'fade' in each tip
      'pauseAfter'           : [],        // array of indexes where to pause the tour after
      'tipAnimationFadeSpeed': 300,       // when tipAnimation = 'fade' this is speed in milliseconds for the transition
      'cookieMonster'        : false,     // true or false to control whether cookies are used
      'cookieName'           : 'joyride', // Name the cookie you'll use
      'cookieDomain'         : false,     // Will this cookie be attached to a domain, ie. '.notableapp.com'
      'cookiePath'           : false,     // Set to '/' if you want the cookie for the whole website
      'localStorage'         : false,     // true or false to control whether localstorage is used
      'localStorageKey'      : 'joyride', // Keyname in localstorage
      'tipContainer'         : 'body',    // Where will the tip be attached
      'modal'                : false,     // Whether to cover page with modal during the tour
      'expose'               : false,     // Whether to expose the elements at each step in the tour (requires modal:true)
      'postExposeCallback'   : $.noop,    // A method to call after an element has been exposed
      'preRideCallback'      : $.noop,    // A method to call before the tour starts (passed index, tip, and cloned exposed element)
      'postRideCallback'     : $.noop,    // A method to call once the tour closes (canceled or complete)
      'preStepCallback'      : $.noop,    // A method to call before each step
      'postStepCallback'     : $.noop,    // A method to call after each step
      'template' : { // HTML segments for tip layout
        'link'    : '<a href="#close" class="joyride-close-tip">X</a>',
        'timer'   : '<div class="joyride-timer-indicator-wrap"><span class="joyride-timer-indicator"></span></div>',
        'tip'     : '<div class="joyride-tip-guide"><span class="joyride-nub"></span></div>',
        'wrapper' : '<div class="joyride-content-wrapper" role="dialog"></div>',
        'button'  : '<a href="#" class="joyride-next-tip"></a>',
        'modal'   : '<div class="joyride-modal-bg"></div>',
        'expose'  : '<div class="joyride-expose-wrapper"></div>',
        'exposeCover': '<div class="joyride-expose-cover"></div>'
      }
    },

    Modernizr = Modernizr || false,

    settings = {},

    methods = {

      init : function (opts) {
        return this.each(function () {

          if ($.isEmptyObject(settings)) {
            settings = $.extend(true, defaults, opts);

            // non configurable settings
            settings.document = window.document;
            settings.$document = $(settings.document);
            settings.$window = $(window);
            settings.$content_el = $(this);
            settings.$body = $(settings.tipContainer);
            settings.body_offset = $(settings.tipContainer).position();
            settings.$tip_content = $('> li', settings.$content_el);
            settings.paused = false;
            settings.attempts = 0;

            settings.tipLocationPatterns = {
              top: ['bottom'],
              bottom: [], // bottom should not need to be repositioned
              left: ['right', 'top', 'bottom'],
              right: ['left', 'top', 'bottom']
            };

            // are we using jQuery 1.7+
            methods.jquery_check();

            // can we create cookies?
            if (!$.isFunction($.cookie)) {
              settings.cookieMonster = false;
            }

            // generate the tips and insert into dom.
            if ( (!settings.cookieMonster || !$.cookie(settings.cookieName) ) &&
              (!settings.localStorage || !methods.support_localstorage() || !localStorage.getItem(settings.localStorageKey) ) ) {

              settings.$tip_content.each(function (index) {
                methods.create({$li : $(this), index : index});
              });

              // show first tip
              if(settings.autoStart)
              {
                if (!settings.startTimerOnClick && settings.timer > 0) {
                  methods.show('init');
                  methods.startTimer();
                } else {
                  methods.show('init');
                }
              }

            }

            settings.$document.on('click.joyride', '.joyride-next-tip, .joyride-modal-bg', function (e) {
              e.preventDefault();

              if (settings.$li.next().length < 1) {
                methods.end();
              } else if (settings.timer > 0) {
                clearTimeout(settings.automate);
                methods.hide();
                methods.show();
                methods.startTimer();
              } else {
                methods.hide();
                methods.show();
              }

            });

            settings.$document.on('click.joyride', '.joyride-close-tip', function (e) {
              e.preventDefault();
              methods.end();
            });

            settings.$window.bind('resize.joyride', function (e) {
              if(settings.$li){
              if(settings.exposed && settings.exposed.length>0){
                var $els = $(settings.exposed);
                $els.each(function(){
                  var $this = $(this);
                  methods.un_expose($this);
                  methods.expose($this);
                });
              }
              if (methods.is_phone()) {
                methods.pos_phone();
              } else {
                methods.pos_default();
              }
              }
            });
          } else {
            methods.restart();
          }

        });
      },

      // call this method when you want to resume the tour
      resume : function () {
        methods.set_li();
        methods.show();
      },

      nextTip: function(){
            if (settings.$li.next().length < 1) {
            methods.end();
            } else if (settings.timer > 0) {
            clearTimeout(settings.automate);
            methods.hide();
            methods.show();
            methods.startTimer();
            } else {
            methods.hide();
            methods.show();
            }
      },

      tip_template : function (opts) {
        var $blank, content, $wrapper;

        opts.tip_class = opts.tip_class || '';

        $blank = $(settings.template.tip).addClass(opts.tip_class);
        content = $.trim($(opts.li).html()) +
          methods.button_text(opts.button_text) +
          settings.template.link +
          methods.timer_instance(opts.index);

        $wrapper = $(settings.template.wrapper);
        if (opts.li.attr('data-aria-labelledby')) {
          $wrapper.attr('aria-labelledby', opts.li.attr('data-aria-labelledby'))
        }
        if (opts.li.attr('data-aria-describedby')) {
          $wrapper.attr('aria-describedby', opts.li.attr('data-aria-describedby'))
        }
        $blank.append($wrapper);
        $blank.first().attr('data-index', opts.index);
        $('.joyride-content-wrapper', $blank).append(content);

        return $blank[0];
      },

      timer_instance : function (index) {
        var txt;

        if ((index === 0 && settings.startTimerOnClick && settings.timer > 0) || settings.timer === 0) {
          txt = '';
        } else {
          txt = methods.outerHTML($(settings.template.timer)[0]);
        }
        return txt;
      },

      button_text : function (txt) {
        if (settings.nextButton) {
          txt = $.trim(txt) || 'Next';
          txt = methods.outerHTML($(settings.template.button).append(txt)[0]);
        } else {
          txt = '';
        }
        return txt;
      },

      create : function (opts) {
        // backwards compatibility with data-text attribute
        var buttonText = opts.$li.attr('data-button') || opts.$li.attr('data-text'),
          tipClass = opts.$li.attr('class'),
          $tip_content = $(methods.tip_template({
            tip_class : tipClass,
            index : opts.index,
            button_text : buttonText,
            li : opts.$li
          })).css('display', 'none');

        $(settings.tipContainer).append($tip_content);
      },

      show : function (init) {
        var opts = {}, ii, opts_arr = [], opts_len = 0, p,
            $timer = null;

        // are we paused?
        if (settings.$li === undefined || ($.inArray(settings.$li.index(), settings.pauseAfter) === -1)) {

          // don't go to the next li if the tour was paused
          if (settings.paused) {
            settings.paused = false;
          } else {
            methods.set_li(init);
          }

          settings.attempts = 0;

          if (settings.$li.length && settings.$target.length > 0) {
            if(init){ //run when we first start
                settings.preRideCallback(settings.$li.index(), settings.$next_tip );
                if(settings.modal){
                    methods.show_modal();
                }
            }
            settings.preStepCallback(settings.$li.index(), settings.$next_tip );

            // parse options
            opts_arr = (settings.$li.data('options') || ':').split(';');
            opts_len = opts_arr.length;
            for (ii = opts_len - 1; ii >= 0; ii--) {
              p = opts_arr[ii].split(':');

              if (p.length === 2) {
                opts[$.trim(p[0])] = $.trim(p[1]);
              }
            }
            settings.tipSettings = $.extend({}, settings, opts);
            settings.tipSettings.tipLocationPattern = settings.tipLocationPatterns[settings.tipSettings.tipLocation];

            if(settings.modal && settings.expose){
              methods.expose();
            }

            // scroll if not modal
            if (!/body/i.test(settings.$target.selector) && settings.scroll) {
              methods.scroll_to();
            }

            if (methods.is_phone()) {
              methods.pos_phone(true);
            } else {
              methods.pos_default(true);
            }

            $timer = $('.joyride-timer-indicator', settings.$next_tip);
            var my = settings.$li.data('my'),
              at = settings.$li.data('at'),
              adjustx = settings.$li.data('adjustx'),
              adjusty = settings.$li.data('adjusty');
            settings.$next_tip = settings.$target.qtip({
                position: {
                    my: my ? my : "top center",
                    at: at ? at : "bottom center",
                    adjust: {
                        x: adjustx ? adjustx : 0,
                        y: adjusty ? adjusty : 0
                    }
                },
                content: {
                    text: settings.$next_tip.find('.joyride-content-wrapper')
                },
                show: {
                    event: false
                },
                hide: {
                    fixed: true,
                    event: false
                },
                style: {
                    tip: {                        
                        width: 12,
                        height: 6
                    }
                }
            });
            settings.$next_tip.qtip('show');
            //settings.$next_tip.fadeIn(settings.tipAnimationFadeSpeed);


            settings.$current_tip = settings.$next_tip;
            // Focus next button for keyboard users.
            $('.joyride-next-tip', settings.$current_tip).focus();
            methods.tabbable(settings.$current_tip);
          // skip non-existent targets
          } else if (settings.$li && settings.$target.length < 1) {

            methods.show();

          } else {

            methods.end();

          }
        } else {

          settings.paused = true;

        }

      },

      // detect phones with media queries if supported.
      is_phone : function () {
        if (Modernizr) {
          return Modernizr.mq('only screen and (max-width: 767px)');
        }

        return (settings.$window.width() < 767) ? true : false;
      },

      support_localstorage : function () {
        if (Modernizr) {
          return Modernizr.localstorage;
        } else {
          return !!window.localStorage;
        }
      },

      hide : function () {
        if(settings.modal && settings.expose){
          methods.un_expose();
        }
        if(!settings.modal){
        $('.joyride-modal-bg').hide();
        }
        settings.$current_tip.qtip('hide');
        settings.postStepCallback(settings.$li.index(), settings.$current_tip);
      },

      set_li : function (init) {
        if (init) {
          settings.$li = settings.$tip_content.eq(settings.startOffset);
          methods.set_next_tip();
          settings.$current_tip = settings.$next_tip;
        } else {
          settings.$li = settings.$li.next();
          methods.set_next_tip();
        }

        methods.set_target();
      },

      set_next_tip : function () {
        settings.$next_tip = $('.joyride-tip-guide[data-index=' + settings.$li.index() + ']');
      },

      set_target : function () {
        var cl = settings.$li.attr('data-class'),
            id = settings.$li.attr('data-id'),
            $sel = function () {
              if (id) {
                return $(settings.document.getElementById(id));
              } else if (cl) {
                return $('.' + cl).filter(":visible").first();
              } else {
                return $('body');
              }
            };

        settings.$target = $sel();
      },

      scroll_to : function () {
        var window_half, tipOffset;

        window_half = settings.$window.height() / 2;
        tipOffset = Math.ceil(settings.$target.offset().top - window_half + settings.$next_tip.outerHeight());

        $("html, body").stop().animate({
          scrollTop: tipOffset
        }, settings.scrollSpeed);
      },

      paused : function () {
        if (($.inArray((settings.$li.index() + 1), settings.pauseAfter) === -1)) {
          return true;
        }

        return false;
      },

      destroy : function () {
        if(!$.isEmptyObject(settings)){
        settings.$document.off('.joyride');
        }

        $(window).off('.joyride');
        $('.joyride-close-tip, .joyride-next-tip, .joyride-modal-bg').off('.joyride');
        $('.joyride-tip-guide, .joyride-modal-bg').remove();
        clearTimeout(settings.automate);
        settings = {};
      },

      restart : function () {
        if(!settings.autoStart)
        {
          if (!settings.startTimerOnClick && settings.timer > 0) {
            methods.show('init');
            methods.startTimer();
          } else {
            methods.show('init');
          }
          settings.autoStart = true;
        }
        else
        {
        methods.hide();
        settings.$li = undefined;
        methods.show('init');
        }
      },

      pos_default : function (init) {
        var half_fold = Math.ceil(settings.$window.height() / 2),
            tip_position = settings.$next_tip.offset(),
            $nub = $('.joyride-nub', settings.$next_tip),
            nub_width = Math.ceil($nub.outerWidth() / 2),
            nub_height = Math.ceil($nub.outerHeight() / 2),
            toggle = init || false;

        // tip must not be "display: none" to calculate position
        if (toggle) {
          settings.$next_tip.css('visibility', 'hidden');
          settings.$next_tip.show();
        }

        if (!/body/i.test(settings.$target.selector)) {
            var
              topAdjustment = settings.tipSettings.tipAdjustmentY ? parseInt(settings.tipSettings.tipAdjustmentY) : 0,
              leftAdjustment = settings.tipSettings.tipAdjustmentX ? parseInt(settings.tipSettings.tipAdjustmentX) : 0;

            if (methods.bottom()) {
              settings.$next_tip.css({
                top: (settings.$target.offset().top + nub_height + settings.$target.outerHeight() + topAdjustment),
                left: settings.$target.offset().left + leftAdjustment});

              if (/right/i.test(settings.tipSettings.nubPosition)) {
                settings.$next_tip.css('left', settings.$target.offset().left - settings.$next_tip.outerWidth() + settings.$target.outerWidth());
              }

              methods.nub_position($nub, settings.tipSettings.nubPosition, 'top');

            } else if (methods.top()) {

              settings.$next_tip.css({
                top: (settings.$target.offset().top - settings.$next_tip.outerHeight() - nub_height + topAdjustment),
                left: settings.$target.offset().left + leftAdjustment});

              methods.nub_position($nub, settings.tipSettings.nubPosition, 'bottom');

            } else if (methods.right()) {

              settings.$next_tip.css({
                top: settings.$target.offset().top + topAdjustment,
                left: (settings.$target.outerWidth() + settings.$target.offset().left + nub_width) + leftAdjustment});

              methods.nub_position($nub, settings.tipSettings.nubPosition, 'left');

            } else if (methods.left()) {

              settings.$next_tip.css({
                top: settings.$target.offset().top + topAdjustment,
                left: (settings.$target.offset().left - settings.$next_tip.outerWidth() - nub_width) + leftAdjustment});

              methods.nub_position($nub, settings.tipSettings.nubPosition, 'right');

            }

            if (!methods.visible(methods.corners(settings.$next_tip)) && settings.attempts < settings.tipSettings.tipLocationPattern.length) {

              $nub.removeClass('bottom')
                .removeClass('top')
                .removeClass('right')
                .removeClass('left');

              settings.tipSettings.tipLocation = settings.tipSettings.tipLocationPattern[settings.attempts];

              settings.attempts++;

              methods.pos_default(true);

            }

        } else if (settings.$li.length) {

          methods.pos_modal($nub);

        }

        if (toggle) {
          settings.$next_tip.hide();
          settings.$next_tip.css('visibility', 'visible');
        }

      },

      pos_phone : function (init) {
        var tip_height = settings.$next_tip.outerHeight(),
            tip_offset = settings.$next_tip.offset(),
            target_height = settings.$target.outerHeight(),
            $nub = $('.joyride-nub', settings.$next_tip),
            nub_height = Math.ceil($nub.outerHeight() / 2),
            toggle = init || false;

        $nub.removeClass('bottom')
          .removeClass('top')
          .removeClass('right')
          .removeClass('left');

        if (toggle) {
          settings.$next_tip.css('visibility', 'hidden');
          settings.$next_tip.show();
        }

        if (!/body/i.test(settings.$target.selector)) {

          if (methods.top()) {

              settings.$next_tip.offset({top: settings.$target.offset().top - tip_height - nub_height});
              $nub.addClass('bottom');

          } else {

            settings.$next_tip.offset({top: settings.$target.offset().top + target_height + nub_height});
            $nub.addClass('top');

          }

        } else if (settings.$li.length) {

          methods.pos_modal($nub);

        }

        if (toggle) {
          settings.$next_tip.hide();
          settings.$next_tip.css('visibility', 'visible');
        }
      },

      pos_modal : function ($nub) {
        methods.center();
        $nub.hide();

        methods.show_modal();

      },

      show_modal : function() {
        if ($('.joyride-modal-bg').length < 1) {
            $('body').append(settings.template.modal).show();
        }

        if (/pop/i.test(settings.tipAnimation)) {
          $('.joyride-modal-bg').show();
        } else {
          $('.joyride-modal-bg').fadeIn(settings.tipAnimationFadeSpeed);
        }
      },

      expose: function(){
        var expose,
          exposeCover,
          el,
          origCSS,
          randId = 'expose-'+Math.floor(Math.random()*10000);
        if (arguments.length>0 && arguments[0] instanceof $){
          el = arguments[0];
        } else if(settings.$target && !/body/i.test(settings.$target.selector)){
          el = settings.$target;
        }  else {
          return false;
        }
        if(el.length < 1){
          if(window.console){
            console.error('element not valid', el);
          }
          return false;
        }
        expose = $(settings.template.expose);
        settings.$body.append(expose);
        expose.css({
          top: el.offset().top,
          left: el.offset().left,
          width: el.outerWidth(true),
          height: el.outerHeight(true)
        });
        exposeCover = $(settings.template.exposeCover);
        origCSS = {
                  zIndex: el.css('z-index'),
                  position: el.css('position')
                  };
        el.css('z-index',expose.css('z-index')*1+1);
        if(origCSS.position == 'static'){
          el.css('position','relative');
        }
        el.data('expose-css',origCSS);
        exposeCover.css({
          top: el.offset().top,
          left: el.offset().left,
          width: el.outerWidth(true),
          height: el.outerHeight(true)
        });
        settings.$body.append(exposeCover);
        expose.addClass(randId);
        exposeCover.addClass(randId);
        if(settings.tipSettings['exposeClass']){
          expose.addClass(settings.tipSettings['exposeClass']);
          exposeCover.addClass(settings.tipSettings['exposeClass']);
        }
        el.data('expose', randId);
        settings.postExposeCallback(settings.$li.index(), settings.$next_tip, el);
        methods.add_exposed(el);
      },

      un_expose: function(){
        var exposeId,
          el,
          expose ,
          origCSS,
          clearAll = false;
        if (arguments.length>0 && arguments[0] instanceof $){
          el = arguments[0];
        } else if(settings.$target && !/body/i.test(settings.$target.selector)){
          el = settings.$target;
        }  else {
          return false;
        }
        if(el.length < 1){
          if(window.console){
            console.error('element not valid', el);
          }
          return false;
        }
        exposeId = el.data('expose');
        expose = $('.'+exposeId);
        if(arguments.length>1){
          clearAll = arguments[1];
        }
        if(clearAll === true){
          $('.joyride-expose-wrapper,.joyride-expose-cover').remove();
        } else {
          expose.remove();
        }
        origCSS = el.data('expose-css');
        if(origCSS.zIndex == 'auto'){
          el.css('z-index', '');
        } else {
          el.css('z-index',origCSS.zIndex);
        }
        if(origCSS.position != el.css('position')){
          if(origCSS.position == 'static'){// this is default, no need to set it.
            el.css('position', '');
          } else {
            el.css('position',origCSS.position);
          }
        }
        el.removeData('expose');
        el.removeData('expose-z-index');
        methods.remove_exposed(el);
      },

      add_exposed: function(el){
        settings.exposed = settings.exposed || [];
        if(el instanceof $){
          settings.exposed.push(el[0]);
        } else if(typeof el == 'string'){
          settings.exposed.push(el);
        }
      },

      remove_exposed: function(el){
        var search;
        if(el instanceof $){
          search = el[0]
        } else if (typeof el == 'string'){
          search = el;
        }
        settings.exposed = settings.exposed || [];
        for(var i=0; i<settings.exposed.length; i++){
          if(settings.exposed[i] == search){
            settings.exposed.splice(i,1);
            return;
          }
        }
      },

      center : function () {
        var $w = settings.$window;

        settings.$next_tip.css({
          top : ((($w.height() - settings.$next_tip.outerHeight()) / 2) + $w.scrollTop()),
          left : ((($w.width() - settings.$next_tip.outerWidth()) / 2) + $w.scrollLeft())
        });

        return true;
      },

      bottom : function () {
        return /bottom/i.test(settings.tipSettings.tipLocation);
      },

      top : function () {
        return /top/i.test(settings.tipSettings.tipLocation);
      },

      right : function () {
        return /right/i.test(settings.tipSettings.tipLocation);
      },

      left : function () {
        return /left/i.test(settings.tipSettings.tipLocation);
      },

      corners : function (el) {
        var w = settings.$window,
            window_half = w.height() / 2,
            tipOffset = Math.ceil(settings.$target.offset().top - window_half + settings.$next_tip.outerHeight()),//using this to calculate since scroll may not have finished yet.
            right = w.width() + w.scrollLeft(),
            offsetBottom =  w.height() + tipOffset,
            bottom = w.height() + w.scrollTop(),
            top = w.scrollTop();

            if(tipOffset < top){
              if (tipOffset <0 ){
                top = 0;
              } else {
                top = tipOffset;
              }
            }

            if(offsetBottom > bottom){
              bottom = offsetBottom;
            }

        return [
          el.offset().top < top,
          right < el.offset().left + el.outerWidth(),
          bottom < el.offset().top + el.outerHeight(),
          w.scrollLeft() > el.offset().left
        ];
      },

      visible : function (hidden_corners) {
        var i = hidden_corners.length;

        while (i--) {
          if (hidden_corners[i]) return false;
        }

        return true;
      },

      nub_position : function (nub, pos, def) {
        if (pos === 'auto') {
          nub.addClass(def);
        } else {
          nub.addClass(pos);
        }
      },

      startTimer : function () {
        if (settings.$li.length) {
          settings.automate = setTimeout(function () {
            methods.hide();
            methods.show();
            methods.startTimer();
          }, settings.timer);
        } else {
          clearTimeout(settings.automate);
        }
      },

      end : function () {
        if (settings.cookieMonster) {
          $.cookie(settings.cookieName, 'ridden', { expires: 365, domain: settings.cookieDomain, path: settings.cookiePath });
        }

        if (settings.localStorage) {
          localStorage.setItem(settings.localStorageKey, true);
        }

        if (settings.timer > 0) {
          clearTimeout(settings.automate);
        }
        if(settings.modal && settings.expose){
          methods.un_expose();
        }
        if (settings.$current_tip) {
          settings.$current_tip.qtip('hide');
        }
        if (settings.$li) {
          settings.postStepCallback(settings.$li.index(), settings.$current_tip);
          settings.postRideCallback(settings.$li.index(), settings.$current_tip);
        }
        $('.joyride-modal-bg').hide();
      },

      jquery_check : function () {
        // define on() and off() for older jQuery
        if (!$.isFunction($.fn.on)) {

          $.fn.on = function (types, sel, fn) {

            return this.delegate(sel, types, fn);

          };

          $.fn.off = function (types, sel, fn) {

            return this.undelegate(sel, types, fn);

          };

          return false;
        }

        return true;
      },

      outerHTML : function (el) {
        // support FireFox < 11
        return el.outerHTML || new XMLSerializer().serializeToString(el);
      },

      version : function () {
        return settings.version;
      },

      tabbable : function (el) {
        $(el).on('keydown', function( event ) {
          if (!event.isDefaultPrevented() && event.keyCode &&
              // Escape key.
              event.keyCode === 27 ) {
            event.preventDefault();
            methods.end();
            return;
          }

          // Prevent tabbing out of tour items.
          if ( event.keyCode !== 9 ) {
            return;
          }
          var tabbables = $(el).find(":tabbable"),
            first = tabbables.filter(":first"),
            last  = tabbables.filter(":last");
          if ( event.target === last[0] && !event.shiftKey ) {
            first.focus( 1 );
            event.preventDefault();
          } else if ( event.target === first[0] && event.shiftKey ) {
            last.focus( 1 );
            event.preventDefault();
          }
        });
      }

    };

  $.fn.joyride = function (method) {
    if (methods[method]) {
      return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
    } else if (typeof method === 'object' || !method) {
      return methods.init.apply(this, arguments);
    } else {
      $.error('Method ' +  method + ' does not exist on jQuery.joyride');
    }
  };

}(njQuery, this));
njQuery(document).ready(function($) {
    var firstcol = $(".smartslider-firstcol");
    var firstcolborder = $(".smartslider-firstcol > .smartslider-border");
    var secondcol = $(".smartslider-secondcol");
    var colresize = function(){
        firstcol.height("auto");
        firstcolborder.height("auto");
        var fcolh = firstcol.height();
        var scolh = secondcol.height();
        if(scolh > fcolh){
            firstcol.height(scolh);
            fcolh = firstcol.height();
        }
        firstcolborder.height(fcolh);
    };
    colresize();
    $(window).resize(colresize);
    window.nextendsmartslidercolresize = colresize;
});
(function($) {
    window.smartSliderSlideOrdering = {
        init: function(url) {
            var ul = $(".smartslider-slides-list");
            ul.qtip({
                id: "slides-ordering",
                content: {
                    text: "Ordering saved!"
                },
                show: {
                    event: false,
                    ready: false
                },
                hide: false,
                position: {
                    my: "bottom center",
                    at: "top center",
                    target: ul,
                    viewport: $(window)
                }
            });
            ul.sortable({
                items: "li.smartslider-slide",
                placeholder: "smartslider-placeholder",
                forcePlaceholderSize: true,
                axis: "y",
                handle: ".smartslider-icon-ordering",
                stop: function(event, ui) {
                    var ajaxcall = url;
                    ajaxcall += (ajaxcall.indexOf("?") ? "&" : "?") + $(this).sortable("serialize");
                    $.ajax({
                        url: ajaxcall,
                        context: document.body
                    }).done(function() {
                        ul.qtip("show");
                        setTimeout(function() {
                            ul.qtip("hide");
                        }, 3000);
                    });
                }
            });
            ul.disableSelection();
        }
    }
})(njQuery);(function($, scope, undefined) {
    scope.ssItemParser = NClass.extend({
        parse: function(name, data){
            var o = {};
            o[name] = data;
            return o;
        },
        render: function(node, data){
            return node;
        }
    });
})(njQuery, window);(function($, scope, undefined) {
    scope.ssItemParserbutton = scope.ssItemParser.extend({
        parse: function(name, data){
            var o = this._super(name, data);
            if(name === 'link'){
                var _d = data.split('|*|');
                o.url = _d[0];
                o.target = _d[1];
                delete o.size;
            }
            return o;
        }
    });
})(njQuery, window);// Spectrum Colorpicker v1.0.9
// https://github.com/bgrins/spectrum
// Author: Brian Grinstead
// License: MIT

(function (window, $, undefined) {
    var defaultOpts = {

        // Events
        beforeShow: noop,
        move: noop,
        change: noop,
        show: noop,
        hide: noop,

        // Options
        color: false,
        flat: false,
        showInput: false,
        showButtons: true,
        clickoutFiresChange: false,
        showInitial: false,
        showPalette: false,
        showPaletteOnly: false,
        showSelectionPalette: true,
        localStorageKey: false,
        maxSelectionSize: 7,
        cancelText: "cancel",
        chooseText: "choose",
        preferredFormat: false,
        className: "",
        showAlpha: false,
        theme: "sp-light",
        palette: ['fff', '000'],
        selectionPalette: [],
        disabled: false
    },
    spectrums = [],
    IE = !!/msie/i.exec( window.navigator.userAgent ),
    rgbaSupport = (function() {
        function contains( str, substr ) {
            return !!~('' + str).indexOf(substr);
        }

        var elem = document.createElement('div');
        var style = elem.style;
        style.cssText = 'background-color:rgba(0,0,0,.5)';
        return contains(style.backgroundColor, 'rgba') || contains(style.backgroundColor, 'hsla');
    })(),
    replaceInput = [
        "<div class='sp-replacer'>",
            "<div class='sp-preview'><div class='sp-preview-inner'></div></div>",
            "<div class='sp-dd'>&#9650;</div>",
        "</div>"
    ].join(''),
    markup = (function () {

        // IE does not support gradients with multiple stops, so we need to simulate
        //  that for the rainbow slider with 8 divs that each have a single gradient
        var gradientFix = "";
        if (IE) {
            for (var i = 1; i <= 6; i++) {
                gradientFix += "<div class='sp-" + i + "'></div>";
            }
        }

        return [
            "<div class='sp-container'>",
                "<div class='sp-palette-container'>",
                    "<div class='sp-palette sp-thumb sp-cf'></div>",
                "</div>",
                "<div class='sp-picker-container'>",
                    "<div class='sp-top sp-cf'>",
                        "<div class='sp-fill'></div>",
                        "<div class='sp-top-inner'>",
                            "<div class='sp-color'>",
                                "<div class='sp-sat'>",
                                    "<div class='sp-val'>",
                                        "<div class='sp-dragger'></div>",
                                    "</div>",
                                "</div>",
                            "</div>",
                            "<div class='sp-hue'>",
                                "<div class='sp-slider'></div>",
                                gradientFix,
                            "</div>",
                        "</div>",
                        "<div class='sp-alpha'><div class='sp-alpha-inner'><div class='sp-alpha-handle'></div></div></div>",
                    "</div>",
                    "<div class='sp-input-container sp-cf'>",
                        "<input class='sp-input' type='text' spellcheck='false'  />",
                    "</div>",
                    "<div class='sp-initial sp-thumb sp-cf'></div>",
                    "<div class='sp-button-container sp-cf'>",
                        "<a class='sp-cancel' href='#'></a>",
                        "<button class='sp-choose'></button>",
                    "</div>",
                "</div>",
            "</div>"
        ].join("");
    })();

    function paletteTemplate (p, color, className) {
        var html = [];
        for (var i = 0; i < p.length; i++) {
            var tiny = tinycolor(p[i]);
            var c = tiny.toHsl().l < 0.5 ? "sp-thumb-el sp-thumb-dark" : "sp-thumb-el sp-thumb-light";
            c += (tinycolor.equals(color, p[i])) ? " sp-thumb-active" : "";

            var swatchStyle = rgbaSupport ? ("background-color:" + tiny.toRgbString()) : "filter:" + tiny.toFilter();
            html.push('<span title="' + tiny.toRgbString() + '" data-color="' + tiny.toRgbString() + '" class="' + c + '"><span class="sp-thumb-inner" style="' + swatchStyle + ';" /></span>');
        }
        return "<div class='sp-cf " + className + "'>" + html.join('') + "</div>";
    }

    function hideAll() {
        for (var i = 0; i < spectrums.length; i++) {
            if (spectrums[i]) {
                spectrums[i].hide();
            }
        }
    }

    function instanceOptions(o, callbackContext) {
        var opts = $.extend({}, defaultOpts, o);
        opts.callbacks = {
            'move': bind(opts.move, callbackContext),
            'change': bind(opts.change, callbackContext),
            'show': bind(opts.show, callbackContext),
            'hide': bind(opts.hide, callbackContext),
            'beforeShow': bind(opts.beforeShow, callbackContext)
        };

        return opts;
    }

    function spectrum(element, o) {

        var opts = instanceOptions(o, element),
            flat = opts.flat,
            showSelectionPalette = opts.showSelectionPalette,
            localStorageKey = opts.localStorageKey,
            theme = opts.theme,
            callbacks = opts.callbacks,
            resize = throttle(reflow, 10),
            visible = false,
            dragWidth = 0,
            dragHeight = 0,
            dragHelperHeight = 0,
            slideHeight = 0,
            slideWidth = 0,
            alphaWidth = 0,
            alphaSlideHelperWidth = 0,
            slideHelperHeight = 0,
            currentHue = 0,
            currentSaturation = 0,
            currentValue = 0,
            currentAlpha = 1,
            palette = opts.palette.slice(0),
            paletteArray = $.isArray(palette[0]) ? palette : [palette],
            selectionPalette = opts.selectionPalette.slice(0),
            draggingClass = "sp-dragging";

        var doc = element.ownerDocument,
            body = doc.body,
            boundElement = $(element),
            disabled = false,
            container = $(markup, doc).addClass(theme),
            dragger = container.find(".sp-color"),
            dragHelper = container.find(".sp-dragger"),
            slider = container.find(".sp-hue"),
            slideHelper = container.find(".sp-slider"),
            alphaSliderInner = container.find(".sp-alpha-inner"),
            alphaSlider = container.find(".sp-alpha"),
            alphaSlideHelper = container.find(".sp-alpha-handle"),
            textInput = container.find(".sp-input"),
            paletteContainer = container.find(".sp-palette"),
            initialColorContainer = container.find(".sp-initial"),
            cancelButton = container.find(".sp-cancel"),
            chooseButton = container.find(".sp-choose"),
            isInput = boundElement.is("input"),
            shouldReplace = isInput && !flat,
            replacer = (shouldReplace) ? $(replaceInput).addClass(theme) : $([]),
            offsetElement = (shouldReplace) ? replacer : boundElement,
            previewElement = replacer.find(".sp-preview-inner"),
            initialColor = opts.color || (isInput && boundElement.val()),
            colorOnShow = false,
            preferredFormat = opts.preferredFormat,
            currentPreferredFormat = preferredFormat,
            clickoutFiresChange = !opts.showButtons || opts.clickoutFiresChange;


        function applyOptions() {

            container.toggleClass("sp-flat", flat);
            container.toggleClass("sp-input-disabled", !opts.showInput);
            container.toggleClass("sp-alpha-enabled", opts.showAlpha);
            container.toggleClass("sp-buttons-disabled", !opts.showButtons || flat);
            container.toggleClass("sp-palette-disabled", !opts.showPalette);
            container.toggleClass("sp-palette-only", opts.showPaletteOnly);
            container.toggleClass("sp-initial-disabled", !opts.showInitial);
            container.addClass(opts.className);

            reflow();
        }

        function initialize() {

            if (IE) {
                container.find("*:not(input)").attr("unselectable", "on");
            }

            applyOptions();

            if (shouldReplace) {
                //boundElement.hide().after(replacer);
                boundElement.parent().after(replacer);
            }

            if (flat) {
                boundElement.parent().after(container).hide();
            }
            else {
                $(body).append(container.hide());
            }

            if (localStorageKey && window.localStorage) {

                // Migrate old palettes over to new format.  May want to remove this eventually.
                try {
                    var oldPalette = window.localStorage[localStorageKey].split(",#");
                    if (oldPalette.length > 1) {
                        delete window.localStorage[localStorageKey];
                        $.each(oldPalette, function(i, c) {
                             addColorToSelectionPalette(c);
                        });
                    }
                }
                catch(e) { }

                try {
                    selectionPalette = window.localStorage[localStorageKey].split(";");
                }
                catch (e) { }
            }

            offsetElement.bind("click.spectrum touchstart.spectrum", function (e) {
                if (!disabled) {
                    toggle();
                }

                e.stopPropagation();

                if (!$(e.target).is("input")) {
                    e.preventDefault();
                }
            });

            if(boundElement.is(":disabled") || (opts.disabled === true)) {
                disable();
            }

            // Prevent clicks from bubbling up to document.  This would cause it to be hidden.
            container.click(stopPropagation);

            // Handle user typed input
            textInput.change(setFromTextInput);
            textInput.bind("paste", function () {
                setTimeout(setFromTextInput, 1);
            });
            textInput.keydown(function (e) { if (e.keyCode == 13) { setFromTextInput(); } });

            cancelButton.text(opts.cancelText);
            cancelButton.bind("click.spectrum", function (e) {
                e.stopPropagation();
                e.preventDefault();
                hide("cancel");
            });

            chooseButton.text(opts.chooseText);
            chooseButton.bind("click.spectrum", function (e) {
                e.stopPropagation();
                e.preventDefault();

                if (isValid()) {
                    updateOriginalInput(true);
                    hide();
                }
            });

            draggable(alphaSlider, function (dragX, dragY, e) {
                currentAlpha = (dragX / alphaWidth);
                if (e.shiftKey) {
                    currentAlpha = Math.round(currentAlpha * 10) / 10;
                }

                move();
            });

            draggable(slider, function (dragX, dragY) {
                currentHue = parseFloat(dragY / slideHeight);
                move();
            }, dragStart, dragStop);

            draggable(dragger, function (dragX, dragY) {
                currentSaturation = parseFloat(dragX / dragWidth);
                currentValue = parseFloat((dragHeight - dragY) / dragHeight);
                move();
            }, dragStart, dragStop);

            if (!!initialColor) {
                set(initialColor);

                // In case color was black - update the preview UI and set the format
                // since the set function will not run (default color is black).
                updateUI();
                currentPreferredFormat = preferredFormat || tinycolor(initialColor).format;

                addColorToSelectionPalette(initialColor);
            }
            else {
                updateUI();
            }

            if (flat) {
                show();
            }

            function palletElementClick(e) {
                if (e.data && e.data.ignore) {
                    set($(this).data("color"));
                    move();
                }
                else {
                    set($(this).data("color"));
                    updateOriginalInput(true);
                    move();
                    hide();
                }

                return false;
            }

            var paletteEvent = IE ? "mousedown.spectrum" : "click.spectrum touchstart.spectrum";
            paletteContainer.delegate(".sp-thumb-el", paletteEvent, palletElementClick);
            initialColorContainer.delegate(".sp-thumb-el:nth-child(1)", paletteEvent, { ignore: true }, palletElementClick);
        }

        function addColorToSelectionPalette(color) {
            if (showSelectionPalette) {
                var colorRgb = tinycolor(color).toRgbString();
                if ($.inArray(colorRgb, selectionPalette) === -1) {
                    selectionPalette.push(colorRgb);
                }

                if (localStorageKey && window.localStorage) {
                    try {
                        window.localStorage[localStorageKey] = selectionPalette.join(";");
                    }
                    catch(e) { }
                }
            }
        }

        function getUniqueSelectionPalette() {
            var unique = [];
            var p = selectionPalette;
            var paletteLookup = {};
            var rgb;

            if (opts.showPalette) {

                for (var i = 0; i < paletteArray.length; i++) {
                    for (var j = 0; j < paletteArray[i].length; j++) {
                        rgb = tinycolor(paletteArray[i][j]).toRgbString();
                        paletteLookup[rgb] = true;
                    }
                }

                for (i = 0; i < p.length; i++) {
                    rgb = tinycolor(p[i]).toRgbString();

                    if (!paletteLookup.hasOwnProperty(rgb)) {
                        unique.push(p[i]);
                        paletteLookup[rgb] = true;
                    }
                }
            }

            return unique.reverse().slice(0, opts.maxSelectionSize);
        }

        function drawPalette() {

            var currentColor = get();

            var html = $.map(paletteArray, function (palette, i) {
                return paletteTemplate(palette, currentColor, "sp-palette-row sp-palette-row-" + i);
            });

            if (selectionPalette) {
                html.push(paletteTemplate(getUniqueSelectionPalette(), currentColor, "sp-palette-row sp-palette-row-selection"));
            }

            paletteContainer.html(html.join(""));
        }

        function drawInitial() {
            if (opts.showInitial) {
                var initial = colorOnShow;
                var current = get();
                initialColorContainer.html(paletteTemplate([initial, current], current, "sp-palette-row-initial"));
            }
        }

        function dragStart() {
            if (dragHeight === 0 || dragWidth === 0 || slideHeight === 0) {
                reflow();
            }
            container.addClass(draggingClass);
        }

        function dragStop() {
            container.removeClass(draggingClass);
        }

        function setFromTextInput() {
            var tiny = tinycolor(textInput.val());
            if (tiny.ok) {
                set(tiny);
            }
            else {
                textInput.addClass("sp-validation-error");
            }
        }

        function toggle() {
            if (visible) {
                hide();
            }
            else {
                show();
            }
        }

        function show() {
            if (visible) {
                reflow();
                return;
            }
            if (callbacks.beforeShow(get()) === false) return;

            hideAll();
            visible = true;

            $(doc).bind("click.spectrum", hide);
            $(window).bind("resize.spectrum", resize);
            replacer.addClass("sp-active");
            container.show();

            if (opts.showPalette) {
                drawPalette();
            }
            reflow();
            updateUI();

            colorOnShow = get();

            drawInitial();
            callbacks.show(colorOnShow);
        }

        function hide(e) {

            // Return on right click
            if (e && e.type == "click" && e.button == 2) { return; }

            // Return if hiding is unnecessary
            if (!visible || flat) { return; }
            visible = false;

            $(doc).unbind("click.spectrum", hide);
            $(window).unbind("resize.spectrum", resize);

            replacer.removeClass("sp-active");
            container.hide();

            var colorHasChanged = !tinycolor.equals(get(), colorOnShow);

            if (colorHasChanged) {
                if (clickoutFiresChange && e !== "cancel") {
                    updateOriginalInput(true);
                }
                else {
                    revert();
                }
            }

            callbacks.hide(get());
        }

        function revert() {
            set(colorOnShow, true);
        }

        function set(color, ignoreFormatChange) {
            if (tinycolor.equals(color, get())) {
                return;
            }

            var newColor = tinycolor(color);
            var newHsv = newColor.toHsv();

            currentHue = newHsv.h;
            currentSaturation = newHsv.s;
            currentValue = newHsv.v;
            currentAlpha = newHsv.a;

            updateUI();

            if (!ignoreFormatChange) {
                currentPreferredFormat = preferredFormat || newColor.format;
            }
        }

        function get() {
            return tinycolor.fromRatio({ h: currentHue, s: currentSaturation, v: currentValue, a: Math.round(currentAlpha * 100) / 100 });
        }

        function isValid() {
            return !textInput.hasClass("sp-validation-error");
        }

        function move() {
            updateUI();

            callbacks.move(get());
        }

        function updateUI() {

            textInput.removeClass("sp-validation-error");

            updateHelperLocations();

            // Update dragger background color (gradients take care of saturation and value).
            var flatColor = tinycolor({ h: currentHue, s: "1.0", v: "1.0" });
            dragger.css("background-color", '#'+flatColor.toHexString());

            // Get a format that alpha will be included in (hex and names ignore alpha)
            var format = currentPreferredFormat;
            if (currentAlpha < 1) {
                if (format === "hex" || format === "name") {
                    format = "rgb";
                }
            }

            var realColor = get(),
                realHex = realColor.toHexString(),
                realRgb = realColor.toRgbString();


            // Update the replaced elements background color (with actual selected color)
            if (rgbaSupport || realColor.alpha === 1) {
                previewElement.css("background-color", realRgb);
            }
            else {
                previewElement.css("background-color", "transparent");
                previewElement.css("filter", realColor.toFilter());
            }

            if (opts.showAlpha) {
                var rgb = realColor.toRgb();
                rgb.a = 0;
                var realAlpha = tinycolor(rgb).toRgbString();
                var gradient = "linear-gradient(left, " + realAlpha + ", " + realHex + ")";

                if (IE) {
                    alphaSliderInner.css("filter", tinycolor(realAlpha).toFilter({ gradientType: 1 }, realHex));
                }
                else {
                    alphaSliderInner.css("background", "-webkit-" + gradient);
                    alphaSliderInner.css("background", "-moz-" + gradient);
                    alphaSliderInner.css("background", "-ms-" + gradient);
                    alphaSliderInner.css("background", gradient);
                }
            }


            // Update the text entry input as it changes happen
            if (opts.showInput) {
                if (currentAlpha < 1) {
                    if (format === "hex" || format === "name") {
                        format = "rgb";
                    }
                }
                textInput.val(realColor.toString(format));
            }

            if (opts.showPalette) {
                drawPalette();
            }

            drawInitial();
        }

        function updateHelperLocations() {
            var s = currentSaturation;
            var v = currentValue;

            // Where to show the little circle in that displays your current selected color
            var dragX = s * dragWidth;
            var dragY = dragHeight - (v * dragHeight);
            dragX = Math.max(
                -dragHelperHeight,
                Math.min(dragWidth - dragHelperHeight, dragX - dragHelperHeight)
            );
            dragY = Math.max(
                -dragHelperHeight,
                Math.min(dragHeight - dragHelperHeight, dragY - dragHelperHeight)
            );
            dragHelper.css({
                "top": dragY,
                "left": dragX
            });

            var alphaX = currentAlpha * alphaWidth;
            alphaSlideHelper.css({
                "left": alphaX - (alphaSlideHelperWidth / 2)
            });

            // Where to show the bar that displays your current selected hue
            var slideY = (currentHue) * slideHeight;
            slideHelper.css({
                "top": slideY - slideHelperHeight
            });
        }

        function updateOriginalInput(fireCallback) {
            var color = get();

            if (isInput) {
                boundElement.val(color.toString(currentPreferredFormat)).change();
            }

            //var hasChanged = !tinycolor.equals(color, colorOnShow);
            var hasChanged = 1;
            
            colorOnShow = color;

            // Update the selection palette with the current color
            addColorToSelectionPalette(color);
            if (fireCallback && hasChanged) {
                callbacks.change(color);
            }
        }

        function reflow() {
            dragWidth = dragger.width();
            dragHeight = dragger.height();
            dragHelperHeight = dragHelper.height();
            slideWidth = slider.width();
            slideHeight = slider.height();
            slideHelperHeight = slideHelper.height();
            alphaWidth = alphaSlider.width();
            alphaSlideHelperWidth = alphaSlideHelper.width();

            if (!flat) {
                container.offset(getOffset(container, offsetElement));
            }

            updateHelperLocations();
        }

        function destroy() {
            boundElement.show();
            offsetElement.unbind("click.spectrum touchstart.spectrum");
            container.remove();
            replacer.remove();
            spectrums[spect.id] = null;
        }

        function option(optionName, optionValue) {
            if (optionName === undefined) {
                return $.extend({}, opts);
            }
            if (optionValue === undefined) {
                return opts[optionName];
            }

            opts[optionName] = optionValue;
            applyOptions();
        }

        function enable() {
            disabled = false;
            boundElement.attr("disabled", false);
            offsetElement.removeClass("sp-disabled");
        }

        function disable() {
            hide();
            disabled = true;
            boundElement.attr("disabled", true);
            offsetElement.addClass("sp-disabled");
        }

        initialize();

        var spect = {
            show: show,
            hide: hide,
            toggle: toggle,
            reflow: reflow,
            option: option,
            enable: enable,
            disable: disable,
            set: function (c) {
                set(c);
                updateOriginalInput();
            },
            get: get,
            destroy: destroy,
            container: container
        };

        spect.id = spectrums.push(spect) - 1;

        return spect;
    }

    /**
    * checkOffset - get the offset below/above and left/right element depending on screen position
    * Thanks https://github.com/jquery/jquery-ui/blob/master/ui/jquery.ui.datepicker.js
    */
    function getOffset(picker, input) {
        var extraY = 0;
        var dpWidth = picker.outerWidth();
        var dpHeight = picker.outerHeight();
        var inputHeight = input.outerHeight();
        var doc = picker[0].ownerDocument;
        var docElem = doc.documentElement;
        var viewWidth = docElem.clientWidth + $(doc).scrollLeft();
        var viewHeight = docElem.clientHeight + $(doc).scrollTop();
        var offset = input.offset();
        offset.top += inputHeight;

        offset.left -=
            Math.min(offset.left, (offset.left + dpWidth > viewWidth && viewWidth > dpWidth) ?
            Math.abs(offset.left + dpWidth - viewWidth) : 0);

        offset.top -=
            Math.min(offset.top, ((offset.top + dpHeight > viewHeight && viewHeight > dpHeight) ?
            Math.abs(dpHeight + inputHeight - extraY) : extraY));

        return offset;
    }

    /**
    * noop - do nothing
    */
    function noop() {

    }

    /**
    * stopPropagation - makes the code only doing this a little easier to read in line
    */
    function stopPropagation(e) {
        e.stopPropagation();
    }

    /**
    * Create a function bound to a given object
    * Thanks to underscore.js
    */
    function bind(func, obj) {
        var slice = Array.prototype.slice;
        var args = slice.call(arguments, 2);
        return function () {
            return func.apply(obj, args.concat(slice.call(arguments)));
        };
    }

    /**
    * Lightweight drag helper.  Handles containment within the element, so that
    * when dragging, the x is within [0,element.width] and y is within [0,element.height]
    */
    function draggable(element, onmove, onstart, onstop) {
        onmove = onmove || function () { };
        onstart = onstart || function () { };
        onstop = onstop || function () { };
        var doc = element.ownerDocument || document;
        var dragging = false;
        var offset = {};
        var maxHeight = 0;
        var maxWidth = 0;
        var hasTouch = ('ontouchstart' in window);

        var duringDragEvents = {};
        duringDragEvents["selectstart"] = prevent;
        duringDragEvents["dragstart"] = prevent;
        duringDragEvents[(hasTouch ? "touchmove" : "mousemove")] = move;
        duringDragEvents[(hasTouch ? "touchend" : "mouseup")] = stop;

        function prevent(e) {
            if (e.stopPropagation) {
                e.stopPropagation();
            }
            if (e.preventDefault) {
                e.preventDefault();
            }
            e.returnValue = false;
        }

        function move(e) {
            if (dragging) {
                // Mouseup happened outside of window
                if (IE && document.documentMode < 9 && !e.button) {
                    return stop();
                }

                var touches = e.originalEvent.touches;
                var pageX = touches ? touches[0].pageX : e.pageX;
                var pageY = touches ? touches[0].pageY : e.pageY;

                var dragX = Math.max(0, Math.min(pageX - offset.left, maxWidth));
                var dragY = Math.max(0, Math.min(pageY - offset.top, maxHeight));

                if (hasTouch) {
                    // Stop scrolling in iOS
                    prevent(e);
                }

                onmove.apply(element, [dragX, dragY, e]);
            }
        }
        function start(e) {
            var rightclick = (e.which) ? (e.which == 3) : (e.button == 2);
            var touches = e.originalEvent.touches;

            if (!rightclick && !dragging) {
                if (onstart.apply(element, arguments) !== false) {
                    dragging = true;
                    maxHeight = $(element).height();
                    maxWidth = $(element).width();
                    offset = $(element).offset();

                    $(doc).bind(duringDragEvents);
                    $(doc.body).addClass("sp-dragging");

                    if (!hasTouch) {
                        move(e);
                    }

                    prevent(e);
                }
            }
        }
        function stop() {
            if (dragging) {
                $(doc).unbind(duringDragEvents);
                $(doc.body).removeClass("sp-dragging");
                onstop.apply(element, arguments);
            }
            dragging = false;
        }

        $(element).bind(hasTouch ? "touchstart" : "mousedown", start);
    }

    function throttle(func, wait, debounce) {
        var timeout;
        return function () {
            var context = this, args = arguments;
            var throttler = function () {
                timeout = null;
                func.apply(context, args);
            };
            if (debounce) clearTimeout(timeout);
            if (debounce || !timeout) timeout = setTimeout(throttler, wait);
        };
    }


    /**
    * Define a jQuery plugin
    */
    var dataID = "spectrum.id";
    $.fn.spectrum = function (opts, extra) {

        if (typeof opts == "string") {

            var returnValue = this;
            var args = Array.prototype.slice.call( arguments, 1 );

            this.each(function () {
                var spect = spectrums[$(this).data(dataID)];
                if (spect) {

                    var method = spect[opts];
                    if (!method) {
                        throw new Error( "Spectrum: no such method: '" + opts + "'" );
                    }

                    if (opts == "get") {
                        returnValue = spect.get();
                    }
                    else if (opts == "container") {
                        returnValue = spect.container;
                    }
                    else if (opts == "option") {
                        returnValue = spect.option.apply(spect, args);
                    }
                    else if (opts == "destroy") {
                        spect.destroy();
                        $(this).removeData(dataID);
                    }
                    else {
                        method.apply(spect, args);
                    }
                }
            });

            return returnValue;
        }

        // Initializing a new instance of spectrum
        return this.spectrum("destroy").each(function () {
            var spect = spectrum(this, opts);
            $(this).data(dataID, spect.id);
        });
    };

    $.fn.spectrum.load = true;
    $.fn.spectrum.loadOpts = {};
    $.fn.spectrum.draggable = draggable;
    $.fn.spectrum.defaults = defaultOpts;

    $.spectrum = { };
    $.spectrum.localization = { };
    $.spectrum.palettes = { };

    $.fn.spectrum.processNativeColorInputs = function () {
        var colorInput = $("<input type='color' value='!' />")[0];
        var supportsColor = colorInput.type === "color" && colorInput.value != "!";

        if (!supportsColor) {
            $("input[type=color]").spectrum({
                preferredFormat: "hex6"
            });
        }
    };

    // TinyColor.js - <https://github.com/bgrins/TinyColor> - 2011 Brian Grinstead - v0.5

    (function (window) {

        var trimLeft = /^[\s,#]+/,
        trimRight = /\s+$/,
        tinyCounter = 0,
        math = Math,
        mathRound = math.round,
        mathMin = math.min,
        mathMax = math.max,
        mathRandom = math.random,
        parseFloat = window.parseFloat;

        function tinycolor(color, opts) {

            // If input is already a tinycolor, return itself
            if (typeof color == "object" && color.hasOwnProperty("_tc_id")) {
                return color;
            }

            var rgb = inputToRGB(color);
            var r = rgb.r, g = rgb.g, b = rgb.b, a = parseFloat(rgb.a), format = rgb.format;

            return {
                ok: rgb.ok,
                format: format,
                _tc_id: tinyCounter++,
                alpha: a,
                toHsv: function () {
                    var hsv = rgbToHsv(r, g, b);
                    return { h: hsv.h, s: hsv.s, v: hsv.v, a: a };
                },
                toHsvString: function () {
                    var hsv = rgbToHsv(r, g, b);
                    var h = mathRound(hsv.h * 360), s = mathRound(hsv.s * 100), v = mathRound(hsv.v * 100);
                    return (a == 1) ?
                  "hsv(" + h + ", " + s + "%, " + v + "%)" :
                  "hsva(" + h + ", " + s + "%, " + v + "%, " + a + ")";
                },
                toHsl: function () {
                    var hsl = rgbToHsl(r, g, b);
                    return { h: hsl.h, s: hsl.s, l: hsl.l, a: a };
                },
                toHslString: function () {
                    var hsl = rgbToHsl(r, g, b);
                    var h = mathRound(hsl.h * 360), s = mathRound(hsl.s * 100), l = mathRound(hsl.l * 100);
                    return (a == 1) ?
                  "hsl(" + h + ", " + s + "%, " + l + "%)" :
                  "hsla(" + h + ", " + s + "%, " + l + "%, " + a + ")";
                },
                toHex: function () {
                    return rgbToHex(r, g, b);
                },
                toHexString: function (force6Char) {
                    return rgbToHex(r, g, b, force6Char);
                },
                toHexString8: function () {
                    return rgbToHex(r, g, b, true)+pad2(mathRound(a*255).toString(16));
                },
                toRgb: function () {
                    return { r: mathRound(r), g: mathRound(g), b: mathRound(b), a: a };
                },
                toRgbString: function () {
                    return (a == 1) ?
                  "rgb(" + mathRound(r) + ", " + mathRound(g) + ", " + mathRound(b) + ")" :
                  "rgba(" + mathRound(r) + ", " + mathRound(g) + ", " + mathRound(b) + ", " + a + ")";
                },
                toName: function () {
                    return hexNames[rgbToHex(r, g, b)] || false;
                },
                toFilter: function (opts, secondColor) {

                    var hex = rgbToHex(r, g, b, true);
                    var secondHex = hex;
                    var alphaHex = Math.round(parseFloat(a) * 255).toString(16);
                    var secondAlphaHex = alphaHex;
                    var gradientType = opts && opts.gradientType ? "GradientType = 1, " : "";

                    if (secondColor) {
                        var s = tinycolor(secondColor);
                        secondHex = s.toHex();
                        secondAlphaHex = Math.round(parseFloat(s.alpha) * 255).toString(16);
                    }

                    return "progid:DXImageTransform.Microsoft.gradient("+gradientType+"startColorstr=#" + pad2(alphaHex) + hex + ",endColorstr=#" + pad2(secondAlphaHex) + secondHex + ")";
                },
                toString: function (format) {
                    format = format || this.format;
                    var formattedString = false;
                    if (format === "rgb") {
                        formattedString = this.toRgbString();
                    }
                    if (format === "hex") {
                        formattedString = this.toHexString();
                    }
                    if (format === "hex6") {
                        formattedString = this.toHexString(true);
                    }
                    if (format === "hex8") {
                        formattedString = this.toHexString8();
                    }
                    if (format === "name") {
                        formattedString = this.toName();
                    }
                    if (format === "hsl") {
                        formattedString = this.toHslString();
                    }
                    if (format === "hsv") {
                        formattedString = this.toHsvString();
                    }

                    return formattedString || this.toHexString(true);
                }
            };
        }

        // If input is an object, force 1 into "1.0" to handle ratios properly
        // String input requires "1.0" as input, so 1 will be treated as 1
        tinycolor.fromRatio = function (color) {

            if (typeof color == "object") {
                for (var i in color) {
                    if (color[i] === 1) {
                        color[i] = "1.0";
                    }
                }
            }

            return tinycolor(color);

        };

        // Given a string or object, convert that input to RGB
        // Possible string inputs:
        //
        //     "red"
        //     "#f00" or "f00"
        //     "#ff0000" or "ff0000"
        //     "rgb 255 0 0" or "rgb (255, 0, 0)"
        //     "rgb 1.0 0 0" or "rgb (1, 0, 0)"
        //     "rgba (255, 0, 0, 1)" or "rgba 255, 0, 0, 1"
        //     "rgba (1.0, 0, 0, 1)" or "rgba 1.0, 0, 0, 1"
        //     "hsl(0, 100%, 50%)" or "hsl 0 100% 50%"
        //     "hsla(0, 100%, 50%, 1)" or "hsla 0 100% 50%, 1"
        //     "hsv(0, 100%, 100%)" or "hsv 0 100% 100%"
        //
        function inputToRGB(color) {

            var rgb = { r: 0, g: 0, b: 0 };
            var a = 1;
            var ok = false;
            var format = false;

            if (typeof color == "string") {
                color = stringInputToObject(color);
            }

            if (typeof color == "object") {
                if (color.hasOwnProperty("r") && color.hasOwnProperty("g") && color.hasOwnProperty("b")) {
                    rgb = rgbToRgb(color.r, color.g, color.b);
                    ok = true;
                    format = "rgb";
                }
                else if (color.hasOwnProperty("h") && color.hasOwnProperty("s") && color.hasOwnProperty("v")) {
                    rgb = hsvToRgb(color.h, color.s, color.v);
                    ok = true;
                    format = "hsv";
                }
                else if (color.hasOwnProperty("h") && color.hasOwnProperty("s") && color.hasOwnProperty("l")) {
                    rgb = hslToRgb(color.h, color.s, color.l);
                    ok = true;
                    format = "hsl";
                }

                if (color.hasOwnProperty("a")) {
                    a = color.a;
                }
            }

            rgb.r = mathMin(255, mathMax(rgb.r, 0));
            rgb.g = mathMin(255, mathMax(rgb.g, 0));
            rgb.b = mathMin(255, mathMax(rgb.b, 0));


            // Don't let the range of [0,255] come back in [0,1].
            // Potentially lose a little bit of precision here, but will fix issues where
            // .5 gets interpreted as half of the total, instead of half of 1.
            // If it was supposed to be 128, this was already taken care of in the conversion function
            if (rgb.r < 1) { rgb.r = mathRound(rgb.r); }
            if (rgb.g < 1) { rgb.g = mathRound(rgb.g); }
            if (rgb.b < 1) { rgb.b = mathRound(rgb.b); }

            return {
                ok: ok,
                format: (color && color.format) || format,
                r: rgb.r,
                g: rgb.g,
                b: rgb.b,
                a: a
            };
        }



        // Conversion Functions
        // --------------------

        // `rgbToHsl`, `rgbToHsv`, `hslToRgb`, `hsvToRgb` modified from:
        // <http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript>

        // `rgbToRgb`
        // Handle bounds / percentage checking to conform to CSS color spec
        // <http://www.w3.org/TR/css3-color/>
        // *Assumes:* r, g, b in [0, 255] or [0, 1]
        // *Returns:* { r, g, b } in [0, 255]
        function rgbToRgb(r, g, b) {
            return {
                r: bound01(r, 255) * 255,
                g: bound01(g, 255) * 255,
                b: bound01(b, 255) * 255
            };
        }

        // `rgbToHsl`
        // Converts an RGB color value to HSL.
        // *Assumes:* r, g, and b are contained in [0, 255] or [0, 1]
        // *Returns:* { h, s, l } in [0,1]
        function rgbToHsl(r, g, b) {

            r = bound01(r, 255);
            g = bound01(g, 255);
            b = bound01(b, 255);

            var max = mathMax(r, g, b), min = mathMin(r, g, b);
            var h, s, l = (max + min) / 2;

            if (max == min) {
                h = s = 0; // achromatic
            }
            else {
                var d = max - min;
                s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
                switch (max) {
                    case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                    case g: h = (b - r) / d + 2; break;
                    case b: h = (r - g) / d + 4; break;
                }

                h /= 6;
            }

            return { h: h, s: s, l: l };
        }

        // `hslToRgb`
        // Converts an HSL color value to RGB.
        // *Assumes:* h is contained in [0, 1] or [0, 360] and s and l are contained [0, 1] or [0, 100]
        // *Returns:* { r, g, b } in the set [0, 255]
        function hslToRgb(h, s, l) {
            var r, g, b;

            h = bound01(h, 360);
            s = bound01(s, 100);
            l = bound01(l, 100);

            function hue2rgb(p, q, t) {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1 / 6) return p + (q - p) * 6 * t;
                if (t < 1 / 2) return q;
                if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                return p;
            }

            if (s === 0) {
                r = g = b = l; // achromatic
            }
            else {
                var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
                var p = 2 * l - q;
                r = hue2rgb(p, q, h + 1 / 3);
                g = hue2rgb(p, q, h);
                b = hue2rgb(p, q, h - 1 / 3);
            }

            return { r: r * 255, g: g * 255, b: b * 255 };
        }

        // `rgbToHsv`
        // Converts an RGB color value to HSV
        // *Assumes:* r, g, and b are contained in the set [0, 255] or [0, 1]
        // *Returns:* { h, s, v } in [0,1]
        function rgbToHsv(r, g, b) {

            r = bound01(r, 255);
            g = bound01(g, 255);
            b = bound01(b, 255);

            var max = mathMax(r, g, b), min = mathMin(r, g, b);
            var h, s, v = max;

            var d = max - min;
            s = max === 0 ? 0 : d / max;

            if (max == min) {
                h = 0; // achromatic
            }
            else {
                switch (max) {
                    case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                    case g: h = (b - r) / d + 2; break;
                    case b: h = (r - g) / d + 4; break;
                }
                h /= 6;
            }
            return { h: h, s: s, v: v };
        }

        // `hsvToRgb`
        // Converts an HSV color value to RGB.
        // *Assumes:* h is contained in [0, 1] or [0, 360] and s and v are contained in [0, 1] or [0, 100]
        // *Returns:* { r, g, b } in the set [0, 255]
        function hsvToRgb(h, s, v) {
            h = bound01(h, 360) * 6;
            s = bound01(s, 100);
            v = bound01(v, 100);

            var i = math.floor(h),
                f = h - i,
                p = v * (1 - s),
                q = v * (1 - f * s),
                t = v * (1 - (1 - f) * s),
                mod = i % 6,
                r = [v, q, p, p, t, v][mod],
                g = [t, v, v, q, p, p][mod],
                b = [p, p, t, v, v, q][mod];

            return { r: r * 255, g: g * 255, b: b * 255 };
        }

        // `rgbToHex`
        // Converts an RGB color to hex
        // Assumes r, g, and b are contained in the set [0, 255]
        // Returns a 3 or 6 character hex
        function rgbToHex(r, g, b, force6Char) {

            var hex = [
                pad2(mathRound(r).toString(16)),
                pad2(mathRound(g).toString(16)),
                pad2(mathRound(b).toString(16))
            ];

            // Return a 3 character hex if possible
            if (!force6Char && hex[0].charAt(0) == hex[0].charAt(1) && hex[1].charAt(0) == hex[1].charAt(1) && hex[2].charAt(0) == hex[2].charAt(1)) {
                return hex[0].charAt(0) + hex[1].charAt(0) + hex[2].charAt(0);
            }

            return hex.join("");
        }

        // `equals`
        // Can be called with any tinycolor input
        tinycolor.equals = function (color1, color2) {
            if (!color1 || !color2) { return false; }
            return tinycolor(color1).toRgbString() == tinycolor(color2).toRgbString();
        };
        tinycolor.random = function () {
            return tinycolor.fromRatio({
                r: mathRandom(),
                g: mathRandom(),
                b: mathRandom()
            });
        };


        // Modification Functions
        // ----------------------
        // Thanks to less.js for some of the basics here
        // <https://github.com/cloudhead/less.js/blob/master/lib/less/functions.js>


        tinycolor.desaturate = function (color, amount) {
            var hsl = tinycolor(color).toHsl();
            hsl.s -= ((amount || 10) / 100);
            hsl.s = clamp01(hsl.s);
            return tinycolor(hsl);
        };
        tinycolor.saturate = function (color, amount) {
            var hsl = tinycolor(color).toHsl();
            hsl.s += ((amount || 10) / 100);
            hsl.s = clamp01(hsl.s);
            return tinycolor(hsl);
        };
        tinycolor.greyscale = function (color) {
            return tinycolor.desaturate(color, 100);
        };
        tinycolor.lighten = function (color, amount) {
            var hsl = tinycolor(color).toHsl();
            hsl.l += ((amount || 10) / 100);
            hsl.l = clamp01(hsl.l);
            return tinycolor(hsl);
        };
        tinycolor.darken = function (color, amount) {
            var hsl = tinycolor(color).toHsl();
            hsl.l -= ((amount || 10) / 100);
            hsl.l = clamp01(hsl.l);
            return tinycolor(hsl);
        };
        tinycolor.complement = function (color) {
            var hsl = tinycolor(color).toHsl();
            hsl.h = (hsl.h + 0.5) % 1;
            return tinycolor(hsl);
        };


        // Combination Functions
        // ---------------------
        // Thanks to jQuery xColor for some of the ideas behind these
        // <https://github.com/infusion/jQuery-xcolor/blob/master/jquery.xcolor.js>

        tinycolor.triad = function (color) {
            var hsl = tinycolor(color).toHsl();
            var h = hsl.h * 360;
            return [
            tinycolor(color),
            tinycolor({ h: (h + 120) % 360, s: hsl.s, l: hsl.l }),
            tinycolor({ h: (h + 240) % 360, s: hsl.s, l: hsl.l })
        ];
        };
        tinycolor.tetrad = function (color) {
            var hsl = tinycolor(color).toHsl();
            var h = hsl.h * 360;
            return [
            tinycolor(color),
            tinycolor({ h: (h + 90) % 360, s: hsl.s, l: hsl.l }),
            tinycolor({ h: (h + 180) % 360, s: hsl.s, l: hsl.l }),
            tinycolor({ h: (h + 270) % 360, s: hsl.s, l: hsl.l })
        ];
        };
        tinycolor.splitcomplement = function (color) {
            var hsl = tinycolor(color).toHsl();
            var h = hsl.h * 360;
            return [
            tinycolor(color),
            tinycolor({ h: (h + 72) % 360, s: hsl.s, l: hsl.l }),
            tinycolor({ h: (h + 216) % 360, s: hsl.s, l: hsl.l })
        ];
        };
        tinycolor.analogous = function (color, results, slices) {
            results = results || 6;
            slices = slices || 30;

            var hsl = tinycolor(color).toHsl();
            var part = 360 / slices;
            var ret = [tinycolor(color)];

            hsl.h *= 360;

            for (hsl.h = ((hsl.h - (part * results >> 1)) + 720) % 360; --results; ) {
                hsl.h = (hsl.h + part) % 360;
                ret.push(tinycolor(hsl));
            }
            return ret;
        };
        tinycolor.monochromatic = function (color, results) {
            results = results || 6;
            var hsv = tinycolor(color).toHsv();
            var h = hsv.h, s = hsv.s, v = hsv.v;
            var ret = [];
            var modification = 1 / results;

            while (results--) {
                ret.push(tinycolor({ h: h, s: s, v: v }));
                v = (v + modification) % 1;
            }

            return ret;
        };
        tinycolor.readable = function (color1, color2) {
            var a = tinycolor(color1).toRgb(), b = tinycolor(color2).toRgb();
            return (
            (b.r - a.r) * (b.r - a.r) +
            (b.g - a.g) * (b.g - a.g) +
            (b.b - a.b) * (b.b - a.b)
        ) > 0x28A4;
        };

        // Big List of Colors
        // ---------
        // <http://www.w3.org/TR/css3-color/#svg-color>
        var names = tinycolor.names = {
            aliceblue: "f0f8ff",
            antiquewhite: "faebd7",
            aqua: "0ff",
            aquamarine: "7fffd4",
            azure: "f0ffff",
            beige: "f5f5dc",
            bisque: "ffe4c4",
            black: "000",
            blanchedalmond: "ffebcd",
            blue: "00f",
            blueviolet: "8a2be2",
            brown: "a52a2a",
            burlywood: "deb887",
            burntsienna: "ea7e5d",
            cadetblue: "5f9ea0",
            chartreuse: "7fff00",
            chocolate: "d2691e",
            coral: "ff7f50",
            cornflowerblue: "6495ed",
            cornsilk: "fff8dc",
            crimson: "dc143c",
            cyan: "0ff",
            darkblue: "00008b",
            darkcyan: "008b8b",
            darkgoldenrod: "b8860b",
            darkgray: "a9a9a9",
            darkgreen: "006400",
            darkgrey: "a9a9a9",
            darkkhaki: "bdb76b",
            darkmagenta: "8b008b",
            darkolivegreen: "556b2f",
            darkorange: "ff8c00",
            darkorchid: "9932cc",
            darkred: "8b0000",
            darksalmon: "e9967a",
            darkseagreen: "8fbc8f",
            darkslateblue: "483d8b",
            darkslategray: "2f4f4f",
            darkslategrey: "2f4f4f",
            darkturquoise: "00ced1",
            darkviolet: "9400d3",
            deeppink: "ff1493",
            deepskyblue: "00bfff",
            dimgray: "696969",
            dimgrey: "696969",
            dodgerblue: "1e90ff",
            firebrick: "b22222",
            floralwhite: "fffaf0",
            forestgreen: "228b22",
            fuchsia: "f0f",
            gainsboro: "dcdcdc",
            ghostwhite: "f8f8ff",
            gold: "ffd700",
            goldenrod: "daa520",
            gray: "808080",
            green: "008000",
            greenyellow: "adff2f",
            grey: "808080",
            honeydew: "f0fff0",
            hotpink: "ff69b4",
            indianred: "cd5c5c",
            indigo: "4b0082",
            ivory: "fffff0",
            khaki: "f0e68c",
            lavender: "e6e6fa",
            lavenderblush: "fff0f5",
            lawngreen: "7cfc00",
            lemonchiffon: "fffacd",
            lightblue: "add8e6",
            lightcoral: "f08080",
            lightcyan: "e0ffff",
            lightgoldenrodyellow: "fafad2",
            lightgray: "d3d3d3",
            lightgreen: "90ee90",
            lightgrey: "d3d3d3",
            lightpink: "ffb6c1",
            lightsalmon: "ffa07a",
            lightseagreen: "20b2aa",
            lightskyblue: "87cefa",
            lightslategray: "789",
            lightslategrey: "789",
            lightsteelblue: "b0c4de",
            lightyellow: "ffffe0",
            lime: "0f0",
            limegreen: "32cd32",
            linen: "faf0e6",
            magenta: "f0f",
            maroon: "800000",
            mediumaquamarine: "66cdaa",
            mediumblue: "0000cd",
            mediumorchid: "ba55d3",
            mediumpurple: "9370db",
            mediumseagreen: "3cb371",
            mediumslateblue: "7b68ee",
            mediumspringgreen: "00fa9a",
            mediumturquoise: "48d1cc",
            mediumvioletred: "c71585",
            midnightblue: "191970",
            mintcream: "f5fffa",
            mistyrose: "ffe4e1",
            moccasin: "ffe4b5",
            navajowhite: "ffdead",
            navy: "000080",
            oldlace: "fdf5e6",
            olive: "808000",
            olivedrab: "6b8e23",
            orange: "ffa500",
            orangered: "ff4500",
            orchid: "da70d6",
            palegoldenrod: "eee8aa",
            palegreen: "98fb98",
            paleturquoise: "afeeee",
            palevioletred: "db7093",
            papayawhip: "ffefd5",
            peachpuff: "ffdab9",
            peru: "cd853f",
            pink: "ffc0cb",
            plum: "dda0dd",
            powderblue: "b0e0e6",
            purple: "800080",
            red: "f00",
            rosybrown: "bc8f8f",
            royalblue: "4169e1",
            saddlebrown: "8b4513",
            salmon: "fa8072",
            sandybrown: "f4a460",
            seagreen: "2e8b57",
            seashell: "fff5ee",
            sienna: "a0522d",
            silver: "c0c0c0",
            skyblue: "87ceeb",
            slateblue: "6a5acd",
            slategray: "708090",
            slategrey: "708090",
            snow: "fffafa",
            springgreen: "00ff7f",
            steelblue: "4682b4",
            tan: "d2b48c",
            teal: "008080",
            thistle: "d8bfd8",
            tomato: "ff6347",
            turquoise: "40e0d0",
            violet: "ee82ee",
            wheat: "f5deb3",
            white: "fff",
            whitesmoke: "f5f5f5",
            yellow: "ff0",
            yellowgreen: "9acd32"
        };

        // Make it easy to access colors via `hexNames[hex]`
        var hexNames = tinycolor.hexNames = flip(names);


        // Utilities
        // ---------

        // `{ 'name1': 'val1' }` becomes `{ 'val1': 'name1' }`
        function flip(o) {
            var flipped = {};
            for (var i in o) {
                if (o.hasOwnProperty(i)) {
                    flipped[o[i]] = i;
                }
            }
            return flipped;
        }

        // Take input from [0, n] and return it as [0, 1]
        function bound01(n, max) {
            if (isOnePointZero(n)) { n = "100%"; }

            var processPercent = isPercentage(n);
            n = mathMin(max, mathMax(0, parseFloat(n)));

            // Automatically convert percentage into number
            if (processPercent) {
                n = n * (max / 100);
            }

            // Handle floating point rounding errors
            if (math.abs(n - max) < 0.000001) {
                return 1;
            }
            else if (n >= 1) {
                return (n % max) / parseFloat(max);
            }
            return n;
        }

        // Force a number between 0 and 1
        function clamp01(val) {
            return mathMin(1, mathMax(0, val));
        }

        // Parse an integer into hex
        function parseHex(val) {
            return parseInt(val, 16);
        }

        // Need to handle 1.0 as 100%, since once it is a number, there is no difference between it and 1
        // <http://stackoverflow.com/questions/7422072/javascript-how-to-detect-number-as-a-decimal-including-1-0>
        function isOnePointZero(n) {
            return typeof n == "string" && n.indexOf('.') != -1 && parseFloat(n) === 1;
        }

        // Check to see if string passed in is a percentage
        function isPercentage(n) {
            return typeof n === "string" && n.indexOf('%') != -1;
        }

        // Force a hex value to have 2 characters
        function pad2(c) {
            return c.length == 1 ? '0' + c : '' + c;
        }

        var matchers = (function () {

            // <http://www.w3.org/TR/css3-values/#integers>
            var CSS_INTEGER = "[-\\+]?\\d+%?";

            // <http://www.w3.org/TR/css3-values/#number-value>
            var CSS_NUMBER = "[-\\+]?\\d*\\.\\d+%?";

            // Allow positive/negative integer/number.  Don't capture the either/or, just the entire outcome.
            var CSS_UNIT = "(?:" + CSS_NUMBER + ")|(?:" + CSS_INTEGER + ")";

            // Actual matching.
            // Parentheses and commas are optional, but not required.
            // Whitespace can take the place of commas or opening paren
            var PERMISSIVE_MATCH3 = "[\\s|\\(]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")\\s*\\)?";
            var PERMISSIVE_MATCH4 = "[\\s|\\(]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")\\s*\\)?";

            return {
                rgb: new RegExp("rgb" + PERMISSIVE_MATCH3),
                rgba: new RegExp("rgba" + PERMISSIVE_MATCH4),
                hsl: new RegExp("hsl" + PERMISSIVE_MATCH3),
                hsla: new RegExp("hsla" + PERMISSIVE_MATCH4),
                hsv: new RegExp("hsv" + PERMISSIVE_MATCH3),
                hex3: /^([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
                hex6: /^([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,
                hex8: /^([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/
            };
        })();

        // `stringInputToObject`
        // Permissive string parsing.  Take in a number of formats, and output an object
        // based on detected format.  Returns `{ r, g, b }` or `{ h, s, l }` or `{ h, s, v}`
        function stringInputToObject(color) {

            color = color.replace(trimLeft, '').replace(trimRight, '').toLowerCase();
            var named = false;
            if (names[color]) {
                color = names[color];
                named = true;
            }
            else if (color == 'transparent') {
                return { r: 0, g: 0, b: 0, a: 0 };
            }

            // Try to match string input using regular expressions.
            // Keep most of the number bounding out of this function - don't worry about [0,1] or [0,100] or [0,360]
            // Just return an object and let the conversion functions handle that.
            // This way the result will be the same whether the tinycolor is initialized with string or object.
            var match;
            if ((match = matchers.rgb.exec(color))) {
                return { r: match[1], g: match[2], b: match[3] };
            }
            if ((match = matchers.rgba.exec(color))) {
                return { r: match[1], g: match[2], b: match[3], a: match[4] };
            }
            if ((match = matchers.hsl.exec(color))) {
                return { h: match[1], s: match[2], l: match[3] };
            }
            if ((match = matchers.hsla.exec(color))) {
                return { h: match[1], s: match[2], l: match[3], a: match[4] };
            }
            if ((match = matchers.hsv.exec(color))) {
                return { h: match[1], s: match[2], v: match[3] };
            }
            if ((match = matchers.hex6.exec(color))) {
                return {
                    r: parseHex(match[1]),
                    g: parseHex(match[2]),
                    b: parseHex(match[3]),
                    format: named ? "name" : "hex"
                };
            }
            if ((match = matchers.hex8.exec(color))) {
                return {
                    r: parseHex(match[1]),
                    g: parseHex(match[2]),
                    b: parseHex(match[3]),
                    a: parseHex(match[4])/255,
                    format: named ? "name" : "hex"
                };
            }
            if ((match = matchers.hex3.exec(color))) {
                return {
                    r: parseHex(match[1] + '' + match[1]),
                    g: parseHex(match[2] + '' + match[2]),
                    b: parseHex(match[3] + '' + match[3]),
                    format: named ? "name" : "hex"
                };
            }

            return false;
        }

        // Everything is ready, expose to window
        window.tinycolor = tinycolor;

    })(this);

    $(function () {
        if ($.fn.spectrum.load) {
            $.fn.spectrum.processNativeColorInputs();
        }
    });

})(window, njQuery);
(function ($, scope, undefined) {
    scope.ssItemParserheading = scope.ssItemParser.extend({
        parse: function (name, data) {
            var o = this._super(name, data);
            if (name === 'link') {
                var _d = data.split('|*|');
                o.url = _d[0];
                o.target = _d[1];
                o.cursor = _d[2];
                delete o.size;
            }else if(name === 'fontsize'){
                if(data != '' && data != 'auto'){
                    o.fontsizer = 'font-size:'+data+'%;';
                }else{
                    o.fontsizer = '';
                }
            }else if(name === 'fontcolor'){
                var _d = data.split('|*|');
                if(parseInt(_d[0])){
                    o.fontcolorr = 'color: #'+_d[1]+';';
                }else{
                    o.fontcolorr = '';
                }
            }
            return o;
        },
        render: function(node, data){
            if(data['url'] == '#'){
                node.html(node.children('a').html());
            }
            return node;
        }
    });
})(njQuery, window);/*! waitForImages jQuery Plugin - v1.5.0 - 2013-07-20
* https://github.com/alexanderdickson/waitForImages
* Copyright (c) 2013 Alex Dickson; Licensed MIT */
;(function ($) {
    // Namespace all events.
    var eventNamespace = 'waitForImages';

    // CSS properties which contain references to images.
    $.waitForImages = {
        hasImageProperties: ['backgroundImage', 'listStyleImage', 'borderImage', 'borderCornerImage', 'cursor']
    };

    // Custom selector to find `img` elements that have a valid `src` attribute and have not already loaded.
    $.expr[':'].uncached = function (obj) {
        // Ensure we are dealing with an `img` element with a valid `src` attribute.
        if (!$(obj).is('img[src!=""]')) {
            return false;
        }

        // Firefox's `complete` property will always be `true` even if the image has not been downloaded.
        // Doing it this way works in Firefox.
        var img = new Image();
        img.src = obj.src;
        return !img.complete;
    };

    $.fn.waitForImages = function (finishedCallback, eachCallback, waitForAll) {

        var allImgsLength = 0;
        var allImgsLoaded = 0;

        // Handle options object.
        if ($.isPlainObject(arguments[0])) {
            waitForAll = arguments[0].waitForAll;
            eachCallback = arguments[0].each;
			// This must be last as arguments[0]
			// is aliased with finishedCallback.
            finishedCallback = arguments[0].finished;
        }

        // Handle missing callbacks.
        finishedCallback = finishedCallback || $.noop;
        eachCallback = eachCallback || $.noop;

        // Convert waitForAll to Boolean
        waitForAll = !! waitForAll;

        // Ensure callbacks are functions.
        if (!$.isFunction(finishedCallback) || !$.isFunction(eachCallback)) {
            throw new TypeError('An invalid callback was supplied.');
        }

        return this.each(function () {
            // Build a list of all imgs, dependent on what images will be considered.
            var obj = $(this);
            var allImgs = [];
            // CSS properties which may contain an image.
            var hasImgProperties = $.waitForImages.hasImageProperties || [];
            // To match `url()` references.
            // Spec: http://www.w3.org/TR/CSS2/syndata.html#value-def-uri
            var matchUrl = /url\(\s*(['"]?)(.*?)\1\s*\)/g;

            if (waitForAll) {

                // Get all elements (including the original), as any one of them could have a background image.
                obj.find('*').addBack().each(function () {
                    var element = $(this);

                    // If an `img` element, add it. But keep iterating in case it has a background image too.
                    if (element.is('img:uncached')) {
                        allImgs.push({
                            src: element.attr('src'),
                            element: element[0]
                        });
                    }

                    $.each(hasImgProperties, function (i, property) {
                        var propertyValue = element.css(property);
                        var match;

                        // If it doesn't contain this property, skip.
                        if (!propertyValue) {
                            return true;
                        }

                        // Get all url() of this element.
                        while (match = matchUrl.exec(propertyValue)) {
                            allImgs.push({
                                src: match[2],
                                element: element[0]
                            });
                        }
                    });
                });
            } else {
                // For images only, the task is simpler.
                obj.find('img:uncached')
                    .each(function () {
                    allImgs.push({
                        src: this.src,
                        element: this
                    });
                });
            }

            allImgsLength = allImgs.length;
            allImgsLoaded = 0;

            // If no images found, don't bother.
            if (allImgsLength === 0) {
                finishedCallback.call(obj[0]);
            }

            $.each(allImgs, function (i, img) {

                var image = new Image();

                // Handle the image loading and error with the same callback.
                $(image).on('load.' + eventNamespace + ' error.' + eventNamespace, function (event) {
                    allImgsLoaded++;

                    // If an error occurred with loading the image, set the third argument accordingly.
                    eachCallback.call(img.element, allImgsLoaded, allImgsLength, event.type == 'load');

                    if (allImgsLoaded == allImgsLength) {
                        finishedCallback.call(obj[0]);
                        return false;
                    }

                });

                image.src = img.src;
            });
        });
    };
}(njQuery));
/* ============================================================
 * jQuery Easing v1.3 - http://gsgd.co.uk/sandbox/jquery/easing/
 *
 * Open source under the BSD License.
 *
 * Copyright © 2008 George McGinley Smith
 * All rights reserved.
 * https://raw.github.com/danro/jquery-easing/master/LICENSE
 * ======================================================== */
 
(function (jQuery) {

jQuery.easing['jswing'] = jQuery.easing['swing'];

jQuery.extend(jQuery.easing, {
    easeInQuad: function(x, t, b, c, d) {
        return c * (t /= d) * t + b;
    },
    easeOutQuad: function(x, t, b, c, d) {
        return -c * (t /= d) * (t - 2) + b;
    },
    easeInOutQuad: function(x, t, b, c, d) {
        if ((t /= d / 2) < 1)
            return c / 2 * t * t + b;
        return -c / 2 * ((--t) * (t - 2) - 1) + b;
    },
    easeInCubic: function(x, t, b, c, d) {
        return c * (t /= d) * t * t + b;
    },
    easeOutCubic: function(x, t, b, c, d) {
        return c * ((t = t / d - 1) * t * t + 1) + b;
    },
    easeInOutCubic: function(x, t, b, c, d) {
        if ((t /= d / 2) < 1)
            return c / 2 * t * t * t + b;
        return c / 2 * ((t -= 2) * t * t + 2) + b;
    },
    easeInQuart: function(x, t, b, c, d) {
        return c * (t /= d) * t * t * t + b;
    },
    easeOutQuart: function(x, t, b, c, d) {
        return -c * ((t = t / d - 1) * t * t * t - 1) + b;
    },
    easeInOutQuart: function(x, t, b, c, d) {
        if ((t /= d / 2) < 1)
            return c / 2 * t * t * t * t + b;
        return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
    },
    easeInQuint: function(x, t, b, c, d) {
        return c * (t /= d) * t * t * t * t + b;
    },
    easeOutQuint: function(x, t, b, c, d) {
        return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
    },
    easeInOutQuint: function(x, t, b, c, d) {
        if ((t /= d / 2) < 1)
            return c / 2 * t * t * t * t * t + b;
        return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
    },
    easeInSine: function(x, t, b, c, d) {
        return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
    },
    easeOutSine: function(x, t, b, c, d) {
        return c * Math.sin(t / d * (Math.PI / 2)) + b;
    },
    easeInOutSine: function(x, t, b, c, d) {
        return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
    },
    easeInExpo: function(x, t, b, c, d) {
        return (t == 0) ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
    },
    easeOutExpo: function(x, t, b, c, d) {
        return (t == d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
    },
    easeInOutExpo: function(x, t, b, c, d) {
        if (t == 0)
            return b;
        if (t == d)
            return b + c;
        if ((t /= d / 2) < 1)
            return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
        return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
    },
    easeInCirc: function(x, t, b, c, d) {
        return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
    },
    easeOutCirc: function(x, t, b, c, d) {
        return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
    },
    easeInOutCirc: function(x, t, b, c, d) {
        if ((t /= d / 2) < 1)
            return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
        return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
    },
    easeInElastic: function(x, t, b, c, d) {
        var s = 1.70158;
        var p = 0;
        var a = c;
        if (t == 0)
            return b;
        if ((t /= d) == 1)
            return b + c;
        if (!p)
            p = d * .3;
        if (a < Math.abs(c)) {
            a = c;
            var s = p / 4;
        }
        else
            var s = p / (2 * Math.PI) * Math.asin(c / a);
        return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
    },
    easeOutElastic: function(x, t, b, c, d) {
        var s = 1.70158;
        var p = 0;
        var a = c;
        if (t == 0)
            return b;
        if ((t /= d) == 1)
            return b + c;
        if (!p)
            p = d * .3;
        if (a < Math.abs(c)) {
            a = c;
            var s = p / 4;
        }
        else
            var s = p / (2 * Math.PI) * Math.asin(c / a);
        return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b;
    },
    easeInOutElastic: function(x, t, b, c, d) {
        var s = 1.70158;
        var p = 0;
        var a = c;
        if (t == 0)
            return b;
        if ((t /= d / 2) == 2)
            return b + c;
        if (!p)
            p = d * (.3 * 1.5);
        if (a < Math.abs(c)) {
            a = c;
            var s = p / 4;
        }
        else
            var s = p / (2 * Math.PI) * Math.asin(c / a);
        if (t < 1)
            return -.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
        return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * .5 + c + b;
    },
    easeInBack: function(x, t, b, c, d, s) {
        if (s == undefined)
            s = 1.70158;
        return c * (t /= d) * t * ((s + 1) * t - s) + b;
    },
    easeOutBack: function(x, t, b, c, d, s) {
        if (s == undefined)
            s = 1.70158;
        return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
    },
    easeInOutBack: function(x, t, b, c, d, s) {
        if (s == undefined)
            s = 1.70158;
        if ((t /= d / 2) < 1)
            return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
        return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
    },
    easeInBounce: function(x, t, b, c, d) {
        return c - jQuery.easing.easeOutBounce(x, d - t, 0, c, d) + b;
    },
    easeOutBounce: function(x, t, b, c, d) {
        if ((t /= d) < (1 / 2.75)) {
            return c * (7.5625 * t * t) + b;
        } else if (t < (2 / 2.75)) {
            return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b;
        } else if (t < (2.5 / 2.75)) {
            return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b;
        } else {
            return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b;
        }
    },
    easeInOutBounce: function(x, t, b, c, d) {
        if (t < d / 2)
            return jQuery.easing.easeInBounce(x, t * 2, 0, c, d) * .5 + b;
        return jQuery.easing.easeOutBounce(x, t * 2 - d, 0, c, d) * .5 + c * .5 + b;
    }
});

jQuery.csseasing = jQuery();
jQuery.extend(jQuery.csseasing, {
    linear: function() {
        return 'linear';
    },
    easeInQuad: function() {
        return 'cubic-bezier(0.550, 0.085, 0.680, 0.530)';
    },
    easeOutQuad: function() {
        return 'cubic-bezier(0.250, 0.460, 0.450, 0.940)';
    },
    easeInOutQuad: function() {
        return 'cubic-bezier(0.455, 0.030, 0.515, 0.955)';
    },
    easeInCubic: function() {
        return 'cubic-bezier(0.550, 0.055, 0.675, 0.190)';
    },
    easeOutCubic: function() {
        return 'cubic-bezier(0.215, 0.610, 0.355, 1.000)';
    },
    easeInOutCubic: function() {
        return 'cubic-bezier(0.645, 0.045, 0.355, 1.000)';
    },
    easeInQuart: function() {
        return 'cubic-bezier(0.895, 0.030, 0.685, 0.220)';
    },
    easeOutQuart: function() {
        return 'cubic-bezier(0.165, 0.840, 0.440, 1.000)';
    },
    easeInOutQuart: function() {
        return 'cubic-bezier(0.770, 0.000, 0.175, 1.000)';
    },
    easeInQuint: function() {
        return 'cubic-bezier(0.755, 0.050, 0.855, 0.060)';
    },
    easeOutQuint: function() {
        return 'cubic-bezier(0.230, 1.000, 0.320, 1.000)';
    },
    easeInOutQuint: function() {
        return 'cubic-bezier(0.860, 0.000, 0.070, 1.000)';
    },
    easeInSine: function() {
        return 'cubic-bezier(0.470, 0.000, 0.745, 0.715)';
    },
    easeOutSine: function() {
        return 'cubic-bezier(0.390, 0.575, 0.565, 1.000)';
    },
    easeInOutSine: function() {
        return 'cubic-bezier(0.445, 0.050, 0.550, 0.950)';
    },
    easeInExpo: function() {
        return 'cubic-bezier(0.950, 0.050, 0.795, 0.035)';
    },
    easeOutExpo: function() {
        return 'cubic-bezier(0.190, 1.000, 0.220, 1.000)';
    },
    easeInOutExpo: function() {
        return 'cubic-bezier(1.000, 0.000, 0.000, 1.000)';
    },
    easeInCirc: function() {
        return 'cubic-bezier(0.600, 0.040, 0.980, 0.335)';
    },
    easeOutCirc: function() {
        return 'cubic-bezier(0.075, 0.820, 0.165, 1.000)';
    },
    easeInOutCirc: function() {
        return 'cubic-bezier(0.785, 0.135, 0.150, 0.860)';
    },
    easeInElastic: function() {
        return 'ease-in';
    },
    easeOutElastic: function() {
        return 'ease-out';
    },
    easeInOutElastic: function() {
        return 'ease-in-out';
    },
    easeInBack: function() {
        return 'cubic-bezier(0.600, -0.280, 0.735, 0.045)';
    },
    easeOutBack: function() {
        return 'cubic-bezier(0.175, 0.885, 0.320, 1.275)';
    },
    easeInOutBack: function() {
        return 'cubic-bezier(0.680, -0.550, 0.265, 1.550)';
    },
    easeInBounce: function() {
        return 'ease-in';
    },
    easeOutBounce: function() {
        return 'ease-out';
    },
    easeInOutBounce: function() {
        return 'ease-in-out';
    }
});

})(njQuery);/*!
 * jQuery Transit - CSS3 transitions and transformations
 * (c) 2011-2012 Rico Sta. Cruz <rico@ricostacruz.com>
 * MIT Licensed.
 *
 * http://ricostacruz.com/jquery.transit
 * http://github.com/rstacruz/jquery.transit
 */

(function ($) {
    $.transit = {
        version: "0.9.9",

        // Map of $.css() keys to values for 'transitionProperty'.
        // See https://developer.mozilla.org/en/CSS/CSS_transitions#Properties_that_can_be_animated
        propertyMap: {
            marginLeft: 'margin',
            marginRight: 'margin',
            marginBottom: 'margin',
            marginTop: 'margin',
            paddingLeft: 'padding',
            paddingRight: 'padding',
            paddingBottom: 'padding',
            paddingTop: 'padding'
        },

        // Will simply transition "instantly" if false
        enabled: true,

        // Set this to false if you don't want to use the transition end property.
        useTransitionEnd: false
    };

    var div = document.createElement('div');
    var support = {};

    // Helper function to get the proper vendor property name.
    // (`transition` => `WebkitTransition`)
    function getVendorPropertyName(prop) {
        // Handle unprefixed versions (FF16+, for example)
        if (prop in div.style) return prop;

        var prefixes = ['Moz', 'Webkit', 'O', 'ms'];
        var prop_ = prop.charAt(0).toUpperCase() + prop.substr(1);

        if (prop in div.style) {
            return prop;
        }

        for (var i = 0; i < prefixes.length; ++i) {
            var vendorProp = prefixes[i] + prop_;
            if (vendorProp in div.style) {
                return vendorProp;
            }
        }
    }

    // Helper function to check if transform3D is supported.
    // Should return true for Webkits and Firefox 10+.
    function checkTransform3dSupport() {
        div.style[support.transform] = '';
        div.style[support.transform] = 'rotateY(90deg)';
        return div.style[support.transform] !== '';
    }

    var isChrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;

    // Check for the browser's transitions support.
    support.transition = getVendorPropertyName('transition');
    support.transitionDelay = getVendorPropertyName('transitionDelay');
    support.transitionProperty = getVendorPropertyName('transitionProperty');
    support.transform = getVendorPropertyName('transform');
    support.transformOrigin = getVendorPropertyName('transformOrigin');
    support.transform3d = checkTransform3dSupport();

    // Non-working transitionend event names are gonna get spliced out on the first event
    var eventNames = [
        'transitionend',
        'webkitTransitionEnd',
        'otransitionend',
        'oTransitionEnd'
    ];
    var transitionEnd = support.transitionEnd = eventNames[support.transition] || null;

    // Populate jQuery's `$.support` with the vendor prefixes we know.
    // As per [jQuery's cssHooks documentation](http://api.jquery.com/jQuery.cssHooks/),
    // we set $.support.transition to a string of the actual property name used.
    for (var key in support) {
        if (support.hasOwnProperty(key) && typeof $.support[key] === 'undefined') {
            $.support[key] = support[key];
        }
    }

    // Avoid memory leak in IE.
    div = null;

    // ## $.cssEase
    // List of easing aliases that you can use with `$.fn.transition`.
    $.cssEase = {
        '_default': 'ease',
        'in': 'ease-in',
        'out': 'ease-out',
        'in-out': 'ease-in-out',
        'snap': 'cubic-bezier(0,1,.5,1)',
        // Penner equations
        'easeOutCubic': 'cubic-bezier(.215,.61,.355,1)',
        'easeInOutCubic': 'cubic-bezier(.645,.045,.355,1)',
        'easeInCirc': 'cubic-bezier(.6,.04,.98,.335)',
        'easeOutCirc': 'cubic-bezier(.075,.82,.165,1)',
        'easeInOutCirc': 'cubic-bezier(.785,.135,.15,.86)',
        'easeInExpo': 'cubic-bezier(.95,.05,.795,.035)',
        'easeOutExpo': 'cubic-bezier(.19,1,.22,1)',
        'easeInOutExpo': 'cubic-bezier(1,0,0,1)',
        'easeInQuad': 'cubic-bezier(.55,.085,.68,.53)',
        'easeOutQuad': 'cubic-bezier(.25,.46,.45,.94)',
        'easeInOutQuad': 'cubic-bezier(.455,.03,.515,.955)',
        'easeInQuart': 'cubic-bezier(.895,.03,.685,.22)',
        'easeOutQuart': 'cubic-bezier(.165,.84,.44,1)',
        'easeInOutQuart': 'cubic-bezier(.77,0,.175,1)',
        'easeInQuint': 'cubic-bezier(.755,.05,.855,.06)',
        'easeOutQuint': 'cubic-bezier(.23,1,.32,1)',
        'easeInOutQuint': 'cubic-bezier(.86,0,.07,1)',
        'easeInSine': 'cubic-bezier(.47,0,.745,.715)',
        'easeOutSine': 'cubic-bezier(.39,.575,.565,1)',
        'easeInOutSine': 'cubic-bezier(.445,.05,.55,.95)',
        'easeInBack': 'cubic-bezier(.6,-.28,.735,.045)',
        'easeOutBack': 'cubic-bezier(.175, .885,.32,1.275)',
        'easeInOutBack': 'cubic-bezier(.68,-.55,.265,1.55)'
    };

    // ## 'transform' CSS hook
    // Allows you to use the `transform` property in CSS.
    //
    //     $("#hello").css({ transform: "rotate(90deg)" });
    //
    //     $("#hello").css('transform');
    //     //=> { rotate: '90deg' }
    //
    $.cssHooks['transit:transform'] = {
        // The getter returns a `Transform` object.
        get: function (elem) {
            return $(elem).data('transform') || new Transform();
        },

        // The setter accepts a `Transform` object or a string.
        set: function (elem, v) {
            var value = v;

            if (!(value instanceof Transform)) {
                value = new Transform(value);
            }

            // We've seen the 3D version of Scale() not work in Chrome when the
            // element being scaled extends outside of the viewport.  Thus, we're
            // forcing Chrome to not use the 3d transforms as well.  Not sure if
            // translate is affectede, but not risking it.  Detection code from
            // http://davidwalsh.name/detecting-google-chrome-javascript
            if (support.transform === 'WebkitTransform' && !isChrome) {
                elem.style[support.transform] = value.toString(true);
            } else {
                elem.style[support.transform] = value.toString();
            }

            $(elem).data('transform', value);
        }
    };

    // Add a CSS hook for `.css({ transform: '...' })`.
    // In jQuery 1.8+, this will intentionally override the default `transform`
    // CSS hook so it'll play well with Transit. (see issue #62)
    $.cssHooks.transform = {
        set: $.cssHooks['transit:transform'].set
    };

    // jQuery 1.8+ supports prefix-free transitions, so these polyfills will not
    // be necessary.
    if ($.fn.jquery < "1.8") {
        // ## 'transformOrigin' CSS hook
        // Allows the use for `transformOrigin` to define where scaling and rotation
        // is pivoted.
        //
        //     $("#hello").css({ transformOrigin: '0 0' });
        //
        $.cssHooks.transformOrigin = {
            get: function (elem) {
                return elem.style[support.transformOrigin];
            },
            set: function (elem, value) {
                elem.style[support.transformOrigin] = value;
            }
        };

        // ## 'transition' CSS hook
        // Allows you to use the `transition` property in CSS.
        //
        //     $("#hello").css({ transition: 'all 0 ease 0' });
        //
        $.cssHooks.transition = {
            get: function (elem) {
                return elem.style[support.transition];
            },
            set: function (elem, value) {
                elem.style[support.transition] = value;
            }
        };
    }

    // ## Other CSS hooks
    // Allows you to rotate, scale and translate.
    registerCssHook('scale');
    registerCssHook('translate');
    registerCssHook('rotate');
    registerCssHook('rotateX');
    registerCssHook('rotateY');
    registerCssHook('rotate3d');
    registerCssHook('perspective');
    registerCssHook('skewX');
    registerCssHook('skewY');
    registerCssHook('x', true);
    registerCssHook('y', true);

    // ## Transform class
    // This is the main class of a transformation property that powers
    // `$.fn.css({ transform: '...' })`.
    //
    // This is, in essence, a dictionary object with key/values as `-transform`
    // properties.
    //
    //     var t = new Transform("rotate(90) scale(4)");
    //
    //     t.rotate             //=> "90deg"
    //     t.scale              //=> "4,4"
    //
    // Setters are accounted for.
    //
    //     t.set('rotate', 4)
    //     t.rotate             //=> "4deg"
    //
    // Convert it to a CSS string using the `toString()` and `toString(true)` (for WebKit)
    // functions.
    //
    //     t.toString()         //=> "rotate(90deg) scale(4,4)"
    //     t.toString(true)     //=> "rotate(90deg) scale3d(4,4,0)" (WebKit version)
    //
    function Transform(str) {
        if (typeof str === 'string') {
            this.parse(str);
        }
        return this;
    }

    Transform.prototype = {
        // ### setFromString()
        // Sets a property from a string.
        //
        //     t.setFromString('scale', '2,4');
        //     // Same as set('scale', '2', '4');
        //
        setFromString: function (prop, val) {
            var args =
                (typeof val === 'string') ? val.split(',') :
                    (val.constructor === Array) ? val :
                        [ val ];

            args.unshift(prop);

            Transform.prototype.set.apply(this, args);
        },

        // ### set()
        // Sets a property.
        //
        //     t.set('scale', 2, 4);
        //
        set: function (prop) {
            var args = Array.prototype.slice.apply(arguments, [1]);
            if (this.setter[prop]) {
                this.setter[prop].apply(this, args);
            } else {
                this[prop] = args.join(',');
            }
        },

        get: function (prop) {
            if (this.getter[prop]) {
                return this.getter[prop].apply(this);
            } else {
                return this[prop] || 0;
            }
        },

        setter: {
            // ### rotate
            //
            //     .css({ rotate: 30 })
            //     .css({ rotate: "30" })
            //     .css({ rotate: "30deg" })
            //     .css({ rotate: "30deg" })
            //
            rotate: function (theta) {
                this.rotate = unit(theta, 'deg');
            },

            rotateX: function (theta) {
                this.rotateX = unit(theta, 'deg');
            },

            rotateY: function (theta) {
                this.rotateY = unit(theta, 'deg');
            },

            // ### scale
            //
            //     .css({ scale: 9 })      //=> "scale(9,9)"
            //     .css({ scale: '3,2' })  //=> "scale(3,2)"
            //
            scale: function (x, y) {
                if (y === undefined) {
                    y = x;
                }
                this.scale = x + "," + y;
            },

            // ### skewX + skewY
            skewX: function (x) {
                this.skewX = unit(x, 'deg');
            },

            skewY: function (y) {
                this.skewY = unit(y, 'deg');
            },

            // ### perspectvie
            perspective: function (dist) {
                this.perspective = unit(dist, 'px');
            },

            // ### x / y
            // Translations. Notice how this keeps the other value.
            //
            //     .css({ x: 4 })       //=> "translate(4px, 0)"
            //     .css({ y: 10 })      //=> "translate(4px, 10px)"
            //
            x: function (x) {
                this.set('translate', x, null);
            },

            y: function (y) {
                this.set('translate', null, y);
            },

            // ### translate
            // Notice how this keeps the other value.
            //
            //     .css({ translate: '2, 5' })    //=> "translate(2px, 5px)"
            //
            translate: function (x, y) {
                if (this._translateX === undefined) {
                    this._translateX = 0;
                }
                if (this._translateY === undefined) {
                    this._translateY = 0;
                }

                if (x !== null && x !== undefined) {
                    this._translateX = unit(x, 'px');
                }
                if (y !== null && y !== undefined) {
                    this._translateY = unit(y, 'px');
                }

                this.translate = this._translateX + "," + this._translateY;
            }
        },

        getter: {
            x: function () {
                return this._translateX || 0;
            },

            y: function () {
                return this._translateY || 0;
            },

            scale: function () {
                var s = (this.scale || "1,1").split(',');
                if (s[0]) {
                    s[0] = parseFloat(s[0]);
                }
                if (s[1]) {
                    s[1] = parseFloat(s[1]);
                }

                // "2.5,2.5" => 2.5
                // "2.5,1" => [2.5,1]
                return (s[0] === s[1]) ? s[0] : s;
            },

            rotate3d: function () {
                var s = (this.rotate3d || "0,0,0,0deg").split(',');
                for (var i = 0; i <= 3; ++i) {
                    if (s[i]) {
                        s[i] = parseFloat(s[i]);
                    }
                }
                if (s[3]) {
                    s[3] = unit(s[3], 'deg');
                }

                return s;
            }
        },

        // ### parse()
        // Parses from a string. Called on constructor.
        parse: function (str) {
            var self = this;
            str.replace(/([a-zA-Z0-9]+)\((.*?)\)/g, function (x, prop, val) {
                self.setFromString(prop, val);
            });
        },

        // ### toString()
        // Converts to a `transition` CSS property string. If `use3d` is given,
        // it converts to a `-webkit-transition` CSS property string instead.
        toString: function (use3d) {
            var re = [];

            for (var i in this) {
                if (this.hasOwnProperty(i)) {
                    // Don't use 3D transformations if the browser can't support it.
                    if ((!support.transform3d) && (
                        (i === 'rotateX') ||
                            (i === 'rotateY') ||
                            (i === 'perspective') ||
                            (i === 'transformOrigin'))) {
                        continue;
                    }

                    if (i[0] !== '_') {
                        if (use3d && (i === 'scale')) {
                            re.push(i + "3d(" + this[i] + ",1)");
                        } else if (use3d && (i === 'translate')) {
                            re.push(i + "3d(" + this[i] + ",0)");
                        } else {
                            re.push(i + "(" + this[i] + ")");
                        }
                    }
                }
            }

            return re.join(" ");
        }
    };

    function callOrQueue(self, queue, fn) {
        if (queue === true) {
            self.queue(fn);
        } else if (queue) {
            self.queue(queue, fn);
        } else {
            fn();
        }
    }

    // ### getProperties(dict)
    // Returns properties (for `transition-property`) for dictionary `props`. The
    // value of `props` is what you would expect in `$.css(...)`.
    function getProperties(props) {
        var re = [];

        $.each(props, function (key) {
            key = $.camelCase(key); // Convert "text-align" => "textAlign"
            key = $.transit.propertyMap[key] || $.cssProps[key] || key;
            key = uncamel(key); // Convert back to dasherized

            if ($.inArray(key, re) === -1) {
                re.push(key);
            }
        });

        return re;
    }

    // ### getTransition()
    // Returns the transition string to be used for the `transition` CSS property.
    //
    // Example:
    //
    //     getTransition({ opacity: 1, rotate: 30 }, 500, 'ease');
    //     //=> 'opacity 500ms ease, -webkit-transform 500ms ease'
    //
    function getTransition(properties, duration, easing, delay) {
        // Get the CSS properties needed.
        var props = getProperties(properties);

        // Account for aliases (`in` => `ease-in`).
        if ($.cssEase[easing]) {
            easing = $.cssEase[easing];
        }

        // Build the duration/easing/delay attributes for it.
        var attribs = '' + toMS(duration) + ' ' + easing;
        if (parseInt(delay, 10) > 0) {
            attribs += ' ' + toMS(delay);
        }

        // For more properties, add them this way:
        // "margin 200ms ease, padding 200ms ease, ..."
        var transitions = [];
        $.each(props, function (i, name) {
            transitions.push(name + ' ' + attribs);
        });

        return transitions.join(', ');
    }

    // ## $.fn.transition
    // Works like $.fn.animate(), but uses CSS transitions.
    //
    //     $("...").transition({ opacity: 0.1, scale: 0.3 });
    //
    //     // Specific duration
    //     $("...").transition({ opacity: 0.1, scale: 0.3 }, 500);
    //
    //     // With duration and easing
    //     $("...").transition({ opacity: 0.1, scale: 0.3 }, 500, 'in');
    //
    //     // With callback
    //     $("...").transition({ opacity: 0.1, scale: 0.3 }, function() { ... });
    //
    //     // With everything
    //     $("...").transition({ opacity: 0.1, scale: 0.3 }, 500, 'in', function() { ... });
    //
    //     // Alternate syntax
    //     $("...").transition({
    //       opacity: 0.1,
    //       duration: 200,
    //       delay: 40,
    //       easing: 'in',
    //       complete: function() { /* ... */ }
    //      });
    //
    $.fn.transition = $.fn.transit = function (properties, duration, easing, callback) {
        var self = this;
        var delay = 0;
        var queue = true;

        var theseProperties = $.extend(true, {}, properties);

        // Account for `.transition(properties, callback)`.
        if (typeof duration === 'function') {
            callback = duration;
            duration = undefined;
        }

        // Account for `.transition(properties, options)`.
        if (typeof duration === 'object') {
            easing = duration.easing;
            delay = duration.delay || 0;
            queue = duration.queue || true;
            callback = duration.complete;
            duration = duration.duration;
        }

        // Account for `.transition(properties, duration, callback)`.
        if (typeof easing === 'function') {
            callback = easing;
            easing = undefined;
        }

        // Alternate syntax.
        if (typeof theseProperties.easing !== 'undefined') {
            easing = theseProperties.easing;
            delete theseProperties.easing;
        }

        if (typeof theseProperties.duration !== 'undefined') {
            duration = theseProperties.duration;
            delete theseProperties.duration;
        }

        if (typeof theseProperties.complete !== 'undefined') {
            callback = theseProperties.complete;
            delete theseProperties.complete;
        }

        if (typeof theseProperties.queue !== 'undefined') {
            queue = theseProperties.queue;
            delete theseProperties.queue;
        }

        if (typeof theseProperties.delay !== 'undefined') {
            delay = theseProperties.delay;
            delete theseProperties.delay;
        }

        // Set defaults. (`400` duration, `ease` easing)
        if (typeof duration === 'undefined') {
            duration = $.fx.speeds._default;
        }
        if (typeof easing === 'undefined') {
            easing = $.cssEase._default;
        }

        duration = toMS(duration);

        // Build the `transition` property.
        var transitionValue = getTransition(theseProperties, duration, easing, delay);

        // Compute delay until callback.
        // If this becomes 0, don't bother setting the transition property.
        var work = $.transit.enabled && support.transition;
        var i = work ? (parseInt(duration, 10) + parseInt(delay, 10)) : 0;

        // If there's nothing to do...
        if (i === 0) {
            var fn = function (next) {
                self.css(theseProperties);
                if (callback) {
                    callback.apply(self);
                }
                if (next) {
                    next();
                }
            };

            callOrQueue(self, queue, fn);
            return self;
        }

        // Save the old transitions of each element so we can restore it later.
        var run = function (nextCall, element) {
            var bound = false;

            var self = $(element);
            var oldTransitions = {};

            // Prepare the callback.
            var cb = function (event) {
                if (bound) {
                    for (var j = bound.length; j > 0; --j) {
                        self.unbind(bound[j], cb);
                        if ((eventNames.length > 1) && (bound[j] !== event.type) && (eventNames.indexOf(bound[j]) !== -1)) {
                            eventNames.splice(eventNames.indexOf(bound[j]), 1);
                        }
                    }
                }

                if (i > 0) {
                    self.each(function () {
                        this.style[support.transition] = (oldTransitions[this] || null);
                    });
                }

                if (typeof callback === 'function') {
                    callback.apply(self);
                }
                if (typeof nextCall === 'function') {
                    nextCall();
                }
            };

            if ((i > 0) && ($.transit.useTransitionEnd)) {
                // Use the 'transitionend' event if it's available.
                bound = eventNames;
                for (var j = 0; j < eventNames.length; ++j) {
                    self.bind(eventNames[j], cb);
                }
            } else {
                // Fallback to timers if the 'transitionend' event isn't supported.
                var id = window.setTimeout(cb, i + 80);
                self.data('transitTimer', id);
            }

            self.data('transitCallback', cb);

            // Apply transitions.
            self.each(function () {
                if (i > 0) {
                    this.style[support.transition] = transitionValue;
                }
                $(this).css(properties);
            });
        };

        // Defer running. This allows the browser to paint any pending CSS it hasn't
        // painted yet before doing the transitions.
        var deferredRun = function (next) {
            this.offsetWidth; // force a repaint
            run(next, this);
        };

        // Use jQuery's fx queue.
        callOrQueue(self, queue, deferredRun);

        // Chainability.
        return this;
    };

    // ## $.fn.transitionStop
    // Works like $.fn.stop( [clearQueue ] [, jumpToEnd ] )
    //     
    $.fn.transitionStop = $.fn.transitStop = function (clearQueue, jumpToEnd) {
        this.each(function () {
            var self = $(this);

            var id = self.data('transitTimer');
            clearTimeout(id);

            self.data('transitTimer', null);

            var properties = this.style[support.transitionProperty];

            if (properties) {
                properties = properties.replace(/-([a-z])/gi, function(s, group1) {
				    return group1.toUpperCase();
				}).replace(/\s*/g, '').split(',');

                var style = window.getComputedStyle(this),
                    css = {};

                for (var i = 0; i < properties.length; i++) {
                    css[properties[i]] = this.style[properties[i]];
                    this.style[properties[i]] = style[properties[i]];
                }

                this.offsetWidth; // force a repaint
                this.style[support.transition] = 'none';

                if (jumpToEnd) {
                    for (var i = 0; i < properties.length; i++)
                        this.style[properties[i]] = css[properties[i]];

                    var cb = self.data('transitCallback');
                    if (typeof cb === 'function') cb();

                    self.data('transitCallback', null);

                } else if (clearQueue) {
                    self.clearQueue();
                    self.unbind(transitionEnd);
                } else {
                    self.dequeue();
                }
                ;
            }
            ;
        });
        return this;
    };

    function registerCssHook(prop, isPixels) {
        // For certain properties, the 'px' should not be implied.
        if (!isPixels) {
            $.cssNumber[prop] = true;
        }

        $.transit.propertyMap[prop] = support.transform;

        $.cssHooks[prop] = {
            get: function (elem) {
                var t = $(elem).css('transit:transform');
                return t.get(prop);
            },

            set: function (elem, value) {
                var t = $(elem).css('transit:transform');
                t.setFromString(prop, value);

                $(elem).css({ 'transit:transform': t });
            }
        };

    }

    // ### uncamel(str)
    // Converts a camelcase string to a dasherized string.
    // (`marginLeft` => `margin-left`)
    function uncamel(str) {
        return str.replace(/([A-Z])/g, function (letter) {
            return '-' + letter.toLowerCase();
        });
    }

    // ### unit(number, unit)
    // Ensures that number `number` has a unit. If no unit is found, assume the
    // default is `unit`.
    //
    //     unit(2, 'px')          //=> "2px"
    //     unit("30deg", 'rad')   //=> "30deg"
    //
    function unit(i, units) {
        if ((typeof i === "string") && (!i.match(/^[\-0-9\.]+$/))) {
            return i;
        } else {
            return "" + i + units;
        }
    }

    // ### toMS(duration)
    // Converts given `duration` to a millisecond string.
    //
    // toMS('fast') => $.fx.speeds[i] => "200ms"
    // toMS('normal') //=> $.fx.speeds._default => "400ms"
    // toMS(10) //=> '10ms'
    // toMS('100ms') //=> '100ms'
    //
    function toMS(duration) {
        var i = duration;

        // Allow string durations like 'fast' and 'slow', without overriding numeric values.
        if (typeof i === 'string' && (!i.match(/^[\-0-9\.]+/))) {
            i = $.fx.speeds[i] || $.fx.speeds._default;
        }

        return unit(i, 'ms');
    }

    // Export some functions for testable-ness.
    $.transit.getTransitionValue = getTransition;
})(njQuery);
(function ($, scope, undefined) {
    scope.ssAnimation = NClass.extend({
        _outplayed: false,
        endFN: null,
        endFired: true,
        init: function (layer, options) {
            var _this = this;
            this.layer = layer;
            this.canvas = $(this.layer).data('slide');
            if (!this.canvas)
                this.canvas = this.layer;
            if (this.layer.animated === undefined)
                this.layer.animated = false;
            this.options = $.extend({
                easingIn: 'linear',
                easingOut: 'linear',
                intervalIn: 400,
                intervalOut: 400,
                delayIn: 0,
                delayOut: 0,
                parallaxIn: 0.45,
                parallaxOut: 0.45,
                animate: "smart-slider-animate",
                animateIn: "smart-slider-animate-in",
                animateOut: "smart-slider-animate-out",
                endFn: function () {
                }
            }, options);
        },
        _initAnimation: function () {
            var $layer = this.layer;
            $(this.canvas).trigger('incrementanimation');
            this.layer.on('ssanimateinstart.ssdefault',function (event) {
                event.stopPropagation();
                $layer.off('ssanimateinstart.ssdefault');
            }).on('ssanimateoutstart.ssdefault',function (event) {
                    event.stopPropagation();
                    $layer.off('ssanimateoutstart.ssdefault');
                }).on('ssanimateinend.ssdefault',function (event) {
                    event.stopPropagation();
                    $layer.off('ssanimateinend.ssdefault');
                }).on('ssanimateoutend.ssdefault', function (event) {
                    event.stopPropagation();
                    $layer.off('ssanimateoutend.ssdefault');
                });
        },
        onResize: function (ratio) {

        },
        setHiddenState: function () {
            if (!this.layer.animated) {
                this._setHiddenState();
            }
        },
        stop: function () {
            if (!this.endFired) {
                this[this.endFN](true);
                this._stop();
                this.endFired = 1;
            }
        },
        _stop: function () {
        },
        _setHiddenState: function () {

        },
        reset: function () {

        },
        setInStart: function () {
            if (!this.layer.animated) {
                this._setInStart();
            }
        },
        _setInStart: function () {
        },
        outPlayed: function (state) {
            if (state === undefined) {
                return this._outplayed;
            }
            this._outplayed = state;
        },
        setOutStart: function () {
            if (!this.layer.animated) {
                this._setOutStart();
            }
        },
        _setOutStart: function () {
            this.layer.css('display', 'block');
        },
        animateIn: function () {
            if (this._canAnimate()) {
                this._initAnimation();
                this.layer.trigger('ssanimateinstart');

                var out = this.layer.data('motionout');
                if (out)
                    out.outPlayed(false);

                this.endFired = 0;
                this._animateIn();
                return true;
            }
            return false;
        },
        onAnimateInEnd: function (forced) {
            if (typeof forced == 'undefined') forced = false;
            if (!this.endFired) {
                this._endAnimate();
                var playoutafter = this.layer.data('playoutafter');
                if (!forced && playoutafter) {
                    var motion = this.layer.data('motionout');
                    motion.animateOut();
                    motion.outPlayed(true);
                } else {
                    this.layer.trigger('ssanimateinend');
                }
                this.endFired = 1;
            }
        },
        animateOut: function () {
            if (this._canAnimate()) {
                this._initAnimation();
                this.layer.trigger('ssanimateoutstart');
                if (this.outPlayed()) {
                    var $this = this;
                    setTimeout(function () {
                        $this.endFired = 0;
                        $this.onAnimateOutEnd();
                    }, 200); // Hack to fire end with some delay if playafterin
                } else {
                    this.endFired = 0;
                    this._animateOut();
                }
                return true;
            }
            return false;
        },
        onAnimateOutEnd: function (forced) {
            if (!this.endFired) {
                this._endAnimate();
                this.layer.trigger('ssanimateoutend');
                this.endFired = 1;
            }
        },
        _canAnimate: function () {
            if (this.layer.animated)
                return false;
            return this.layer.animated = true;
        },
        _endAnimate: function () {
            this.layer.animated = false;
            this.options.endFn();
            $(this.canvas).trigger('decrementanimation');
        }
    });

    scope.ssAnimationManagerClass = NClass.extend({
        init: function () {
            this.animations = {};
        },
        addAnimation: function (name, classdefinition, options) {
            this.animations[name] = {
                classdefinition: classdefinition,
                options: options
            };
        },
        getAnimation: function (name, layer, options) {
            if (this.animations[name] === undefined) {
                name = 'no';
            }
            return new this.animations[name].classdefinition(layer, $.extend(this.animations[name].options, options));
        }
    });
    if (scope.ssAnimationManager === undefined)
        scope.ssAnimationManager = new scope.ssAnimationManagerClass();

})(njQuery, window);;
(function ($, scope, undefined) {
    var methods = {
        init: function (options) {
            var settings = $.extend({
            }, options);
            return this.each(function () {
                var $this = $(this),
                    data = $this.data('smartslider');
                if (!data) {
                    $(this).data('smartslider', {
                        slider: smartsliderbase($this, settings)
                    });
                    data = $this.data('smartslider');
                }
            });

        },
        next: function () {
            return this.each(function () {
                var $this = $(this),
                    data = $this.data('smartslider');
                data.slider.next();
            });
        },
        previous: function () {
            return this.each(function () {
                var $this = $(this),
                    data = $this.data('smartslider');
                data.slider.previous();
            });
        },
        goto: function (i, reversed) {
            return this.each(function () {
                var $this = $(this),
                    data = $this.data('smartslider');
                data.slider.goto(i, reversed);
            });
        },
        startautoplay: function () {
            return this.each(function () {
                var $this = $(this),
                    data = $this.data('smartslider');
                data.slider.startautoplay();
            });
        },
        pauseautoplay: function () {
            return this.each(function () {
                var $this = $(this),
                    data = $this.data('smartslider');
                data.slider.pauseautoplay();
            });
        }
    };

    $.fn.extend({
        smartslider: function (method) {
            this.defaultOptions = {};

            var options = $.extend({}, this.defaultOptions, options);

            if (methods[method]) {
                return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
            } else if (typeof method === 'object' || !method) {
                return methods.init.apply(this, arguments);
            } else {
                $.error('Method ' + method + ' does not exist on jQuery.tooltip');
            }
        }
    });

    window.smartslider = {};
    window.smartslider.motions = {};

    window.smartsliderbase = function (el, options) {
        var proto = function (el, options) {
            var $this = this;
            this.$el = el;
            this.options = options;

            this.canvasList = null;

            this.slideAnimateIn = "smart-slider-slide-animate-in";
            this.slideAnimateOut = "smart-slider-slide-animate-out";
            this.slideActive = "smart-slider-slide-active";

            this.mainslider = new scope[options.type](this, el, options);

            this.next = function () {
                this.mainslider.next();
            };

            this.previous = function () {
                this.mainslider.previous();
            };

            this.goto = function (i, reversed) {
                this.mainslider.changeTo(i, reversed);
            };

            this.startautoplay = function () {
                this.mainslider.reStartAutoPlay();
            };

            this.pauseautoplay = function () {
                this.mainslider.pauseAutoPlay();
            };
        };
        return new proto(el, options);
    };

})(njQuery, window);;
(function ($, scope, undefined) {
    scope.ssTypeBase = NClass.extend({
        $this: null,
        $slider: null,
        slideList: null,
        _parent: null,
        _active: -1,
        _lastActive: -1,
        _animating: false,
        _runningAnimations: 0,
        lastAvailableWidth: 0,
        init: function (parent, $el, options) {
            this.options = {
                syncAnimations: 1,
                translate3d: 1,
                mainlayer: true,
                playfirstlayer: 0,
                mainafterout: 1,
                inaftermain: 1,
                fadeonscroll: 0,
                autoplay: 0,
                autoplayConfig: {
                    duration: 5000,
                    counter: 0,
                    autoplayToSlide: 0,
                    stopautoplay: {
                        click: 1,
                        mouseenter: 1,
                        slideplaying: 1
                    },
                    resumeautoplay: {
                        mouseleave: 0,
                        slideplayed: 1
                    }
                },
                responsive: {
                    downscale: 0,
                    upscale: 0
                },
                controls: {
                    scroll: 0,
                    touch: 0
                },
                blockrightclick: 0
            };
            this.slideDimension = {
                w: 0,
                h: 0
            };
            
             
            var _this = this;
            this._parent = parent;

            $.extend(this.options, options);
            this.options.syncAnimations = this.options.mainafterout;

            this.$slider = $el;
            if (this.options.translate3d && nModernizr && nModernizr.csstransforms3d) {
                this.$slider.css(nModernizr.prefixed('transform'), 'translate3d(0,0,0)');
                this.$slider.css(nModernizr.prefixed('perspective'), '1000');
            }
            
            if(this.options.blockrightclick && window.ssadmin !== 1){
                this.$slider.bind("contextmenu",function(e){
                    e.preventDefault();
                }); 
            }

            this.id = $el.attr('id');

            this.$this = $(this);

            this.slideList = $('.smart-slider-canvas', $el);

            this.slideDimension.w = this.slideList.width();
            this.slideDimension.h = this.slideList.height();

            for (var i = 0; i < this.slideList.length; i++) {
                var slide = this.slideList[i];

                // syncronize layer animations with the slide changing
                slide.ssanimation = 0;
                this.slideList.eq(i).on('incrementanimation.ssanimation',function () {
                    this.ssanimation++;
                }).on('decrementanimation.ssanimation',function () {
                        this.ssanimation--;
                        if (this.ssanimation === 0) {
                            $(this).trigger('ssanimationsended');
                        }
                    }).on('noanimation.ssanimation', function () {
                        if (this.ssanimation === 0) {
                            $(this).trigger('ssanimationsended');
                        }
                    });

                // init layers
                slide.layers = new scope.ssLayers(this, slide, {
                    width: this.slideDimension.w,
                    height: this.slideDimension.h,
                    mainlayer: this.options.mainlayer
                });
            }
            
            this.slidebgList = $('.nextend-slide-bg', $el);
            this.slidebgList.width(this.slideDimension.w);

            this._active = this.slideList.index($('.' + this._parent.slideActive, $el));
            
            this.sizeInited();

            this._bullets = this.$slider.find('.nextend-bullet-container > .nextend-bullet');
            this._bullets.removeClass('active');
            this._bullets.eq(this._active).addClass('active');

            this._bar = this.$slider.find('.nextend-bar-slide');
            this._bar.removeClass('active');
            this._bar.eq(this._active).addClass('active');


            this._thumbnails = window[this.id + '-thumbnail'];
            this.changeThumbnail(this._active);


            if (window.ssadmin !== 1) {
                _this._animating = true;
                
                $(this).on('load.first', function () {
                    $(this).off('load.first');
                    
                    var show = function(){
                        _this.$slider.addClass('nextend-loaded');
                        $('#'+_this.id+'-placeholder').remove();
                        
                        _this.$slider.trigger('loaded');
                        
                        _this._animating = false;
                        if (_this.options.playfirstlayer) {
                            var canvas = $(_this.slideList[_this._active]);
                            canvas.on('ssanimationsended.first',function () {
                                $(this).off('ssanimationsended.first');
                            }).trigger('ssanimatelayersin');
                        }
                        _this.startAutoplay();
                    };
                    
                    if(_this.options.fadeonscroll){
                        var w = $(window),
                            t = _this.$slider.offset().top+_this.$slider.outerHeight()/2;
                        if(w.scrollTop()+w.height() > t){
                            show();
                        }else{
                            w.on('scroll.'+_this.id, function(){
                                if(w.scrollTop()+w.height() > t){
                                    w.off('scroll.'+_this.id);
                                    show();
                                }
                            });
                        }
                    }else{
                        show();
                    }
                });
                
                if (this.options.responsive.downscale || this.options.responsive.upscale) {
                    this.storeDefaults();
                    this.onResize();

                    $(window).on('resize', function () {
                        _this.onResize();
                    });
                    if(typeof artxJQuery != "undefined"){
                        artxJQuery(window).on('responsive', function () {
                            _this.onResize();
                        });
                    }
                } else {
                    this.$slider.waitForImages(function () {
                        $(_this).trigger('load');
                    });
                }

                if (!this.options.playfirstlayer) {
                    this.slideList[this._active].layers.setOutStart();
                }

                this.initAutoplay();
                this.initWidgets();
                this.initScroll();
                this.initTouch();
				this.initEvents();

            } else {
                $(this).trigger('load');
            }
        },
        sizeInited: function(){
        
        },
        storeDefaults: function () {

        },
        onResize: function () {
            var _this = this;
            this.$slider.waitForImages(function () {
                $(_this).trigger('load');
            });
        },
        initWidgets: function () {
            var timeout = null,
                widgets = this.$slider.find('.nextend-widget-hover');
            if (widgets.length > 0) {
                this.$slider.on('mouseenter',function () {
                    var slide = this;
                    if (timeout) clearTimeout(timeout);
                    widgets.css('visibility', 'visible');
                    setTimeout(function () {
                        $(slide).addClass('nextend-widget-hover-show');
                    }, 50);
                }).on('mouseleave', function () {
                        var slide = this;
                        if (timeout) clearTimeout(timeout);
                        timeout = setTimeout(function () {
                            $(slide).removeClass('nextend-widget-hover-show');
                            timeout = setTimeout(function () {
                                widgets.css('visibility', 'hidden');
                            }, 400);
                        }, 500);
                    });
            }
        },
        initScroll: function () {
            if (this.options.controls.scroll == 0) return;
            var _this = this;
            this.$slider.on('mousewheel', function (e, delta, deltaX, deltaY) {
                if (delta < 0) {
                    _this.next();
                } else {
                    _this.previous();
                }
                e.preventDefault();
            });
        },
        initTouch: function () {
            if (this.options.controls.touch == '0') return;
            var _this = this;
            var mode = this.options.controls.touch;
            this.$slider.swipe({
                swipe: function (event, direction, distance, duration, fingerCount) {
                    if (mode == 'horizontal') {
                        if (direction == 'right') {
                            _this.previous();
                        } else if (direction == 'left') {
                            _this.next();
                        }
                    } else if (mode == 'vertical') {
                        if (direction == 'down') {
                            _this.previous();
                        } else if (direction == 'up') {
                            _this.next();
                        }
                    }
                },
                fallbackToMouseEvents: false,
                allowPageScroll: (mode == 'horizontal' ? 'vertical' : 'horizontal')
            });
        },
    		initEvents: function(){
    			this.$slider.find("*[data-click]").each(function(){
    				var thisme = $(this);
    				if(thisme.data('click')!=""){
    					thisme.on("click", function(){eval(thisme.data('click'));});
    				}
    			});
    			this.$slider.find("*[data-enter]").each(function(){
    				var thisme = $(this);
    				if(thisme.data('enter')!=""){
    					thisme.on("mouseenter", function(){eval(thisme.data('enter'));});
    				}
    			});
    			this.$slider.find("*[data-leave]").each(function(){
    				var thisme = $(this);
    				if(thisme.data('leave')!=""){
    					thisme.on("mouseleave", function(){eval(thisme.data('leave'));});
    				}
    			});
    		},
        next: function (autoplay) {
            var i = this._active + 1;
            if (i === this.slideList.length)
                i = 0;
            return this.changeTo(i, false, autoplay);
        },
        previous: function (autoplay) {
            var i = this._active - 1;
            if (i < 0)
                i = this.slideList.length - 1;
            return this.changeTo(i, true, autoplay);
        },
        changeTo: function (i, reversed, autoplay) {
            if (window.ssadmin || i === this._active || this._animating)
                return false;
            if (!this.options.syncAnimations) {
                if (this._lastActive != i) this.slideList.eq(this._lastActive).trigger('ssanimatestop');
                this.slideList.eq(this._active).trigger('ssanimatestop');
            }

            var _this = this;

            this.pauseAutoPlay(true);

            this._animating = true;

            if (this.options.syncAnimations) _this._runningAnimations++;

            this._nextActive = i;

            this.changeBullet(i);

            $(this).trigger('mainanimationstart');

            var $currentactiveslide = this.slideList.eq(this._active),
                $nextactiveslide = this.slideList.eq(i),
                playin = function () {

                    if (_this.options.inaftermain) {

                        $nextactiveslide.trigger('ssanimatelayerssetinstart');

                        _this.$this.on('mainanimationinend.inaftermain', function () {
                            _this.$this.off('mainanimationinend.inaftermain');
                            $nextactiveslide.trigger('ssanimatelayersin');
                        });
                        _this._runningAnimations++;
                        _this.animateIn(i, reversed);
                    } else {
                        _this._runningAnimations++;
                        _this.animateIn(i, reversed);
                        $nextactiveslide.trigger('ssanimatelayersin');
                    }
                };


            if (this.options.mainafterout) {
                $currentactiveslide.on('ssanimationsended.ssinaftermain', function () {
                    $currentactiveslide.off('ssanimationsended.ssinaftermain');
                    _this._runningAnimations++;
                    _this.animateOut(_this._active, reversed);
                    playin();
                });

                if (this.options.syncAnimations) {
                    $currentactiveslide.trigger('ssanimatelayersout');
                }
            } else {
                this._runningAnimations++;
                this.animateOut(this._active, reversed);

                if (this.options.syncAnimations) {
                    $currentactiveslide.trigger('ssanimatelayersout');
                }

                playin();
            }

        },
        animateOut: function (i, reversed) {
            var _this = this;
            this._lastActive = i;
            var $slide = this.slideList.eq(i);

            var motion = ssAnimationManager.getAnimation('no', $slide);
            $slide.on('ssanimationsended.ssmainanimateout',function () {
                $slide.off('ssanimationsended.ssmainanimateout');
                _this.$this.trigger('mainanimationoutend');
                _this.mainanimationended();
            }).trigger('ssoutanimationstart');
            motion.animateOut();
        },
        animateIn: function (i, reversed) {
            var _this = this;
            this._active = i;
            var $slide = this.slideList.eq(i);
            var motion = ssAnimationManager.getAnimation('no', $slide);
            $slide.on('ssanimationsended.ssmainanimatein',function () {
                $slide.off('ssanimationsended.ssmainanimatein');
                _this.$this.trigger('mainanimationinend');
                _this.mainanimationended();
                _this.mainanimationended();
            }).trigger('ssinanimationstart');
            motion.animateIn();
        },
        mainanimationended: function () {
            this._runningAnimations--;
            if (this._runningAnimations === 0) {
                this.slideList.eq(this._lastActive).removeClass(this._parent.slideActive);
                this.slideList[this._lastActive].layers.setHiddenState();
                this.slideList.eq(this._active).addClass(this._parent.slideActive);
                this._animating = false;
                this.$this.trigger('mainanimationend');
                this.startAutoplay();
            } else if (this._runningAnimations < 0) {
                this._runningAnimations = 0;
            }
        },
        changeBullet: function (i) {
            this._bullets.removeClass('active');
            this._bullets.eq(i).addClass('active');
            this._bar.removeClass('active');
            this._bar.eq(i).addClass('active');

            this.changeThumbnail(i);
        },
        changeThumbnail: function (i) {
            if (this._thumbnails) this._thumbnails.change(i);
        },

        initAutoplay: function () {
            var _this = this;
            this.indicator = window[this.id + '-indicator'];
            if (!this.indicator) {
                this.indicator = {
                    hide: function () {
                    },
                    show: function () {
                    },
                    refresh: function (val) {
                    }
                };
            }
            this.indicator.reset = function () {
                _this.indicatorProgress = 0;
                this.refresh(0);
            }
            this.autoplayTimer = null;
            var autoplay = this.options.autoplayConfig;
            if (autoplay.stopautoplay.click) {
                this.$slider.find('> div').eq(0).on('click', function () {
                    _this.pauseAutoPlay();
                });
            }
            if (autoplay.stopautoplay.mouseenter) {
                this.$slider.find('> div').eq(0).on('mouseenter', function () {
                    _this.pauseAutoPlay();
                });
            }
            if (autoplay.stopautoplay.slideplaying) {
                this.$slider.on('ssplaystarted', function () {
                    _this.pauseAutoPlay();
                });
            }
            if (autoplay.resumeautoplay.mouseleave) {
                this.$slider.on('mouseleave', function () {
                    if (!_this.autoplayTimer)
                        _this.reStartAutoPlay();
                });
            }
            if (autoplay.resumeautoplay.slideplayed) {
                this.$slider.on('ssplayended', function () {
                    if (!_this.autoplayTimer)
                        _this.reStartAutoPlay();
                });
            }

            if (!this.autoplaybutton) this.autoplaybutton = this.$slider.find('.nextend-autoplay-button');
            if (!this.indicatorEl) this.indicatorEl = $('<div></div>');

            if (this.options.autoplay) {
                this.startAutoplay = this.startAutoplayWorking;
                this.startAutoplay();
            } else {
                this.pauseAutoPlay();
            }

        },

        startAutoplay: function () {

        },

        startAutoplayWorking: function () {
            var _this = this,
                duration = this.options.autoplayConfig.duration;

            if (this.autoplayTimer) {
                clearTimeout(this.autoplayTimer);
                this.autoplayTimer = null;
            }

            if (this.indicator) {
                var shift = 0,
                    d = duration,
                    prevProgress = 0,
                    invPrevProgress = 1;
                if (this.indicatorEl.data('animating') && _this.indicatorProgress) {
                    d *= (1 - _this.indicatorProgress);
                    prevProgress = _this.indicatorProgress;
                    invPrevProgress = 1 - prevProgress;
                } else {
                    this.indicator.refresh(0);
                }
                this.indicatorEl.animate({
                    width: 1
                }, {
                    duration: d,
                    progress: function (e, i) {
                        var j = prevProgress + invPrevProgress * i;
                        _this.indicator.refresh(j * 100);
                        _this.indicatorProgress = j;
                    },
                    complete: function () {
                        _this.options.autoplayConfig.counter++;
                        _this.next(true);
                        _this.indicatorEl.data('animating', false);
                        _this.indicatorEl.stop(true);
                        _this.indicatorProgress = 0;
                        if(!_this.options.autoplayConfig.autoplayToSlide || _this.options.autoplayConfig.counter < _this.options.autoplayConfig.autoplayToSlide-1) _this.reStartAutoPlay();
                    }
                });
                this.indicatorEl.data('animating', true);
            } else {

                this.autoplayTimer = setTimeout(function () {
                    this.options.autoplayConfig.counter++;
                    _this.next(true);
                    _this.indicatorEl.stop(true);

                    _this.indicator.refresh(100);
                    if(!_this.options.autoplayConfig.autoplayToSlide || _this.options.autoplayConfig.counter < _this.options.autoplayConfig.autoplayToSlide-1) _this.reStartAutoPlay();
                }, duration);
            }
        },

        pauseAutoPlay: function (reset) {
            if (this.autoplayTimer) {
                clearTimeout(this.autoplayTimer);
                this.autoplayTimer = null;
            }
            this.autoplaybutton.addClass('paused');
            this.indicatorEl.stop(true);
            if (reset) {
                this.indicator.reset();
            }
            this.startAutoplay = function () {
            };
        },
        reStartAutoPlay: function () {
            this.autoplaybutton.removeClass('paused');
            this.startAutoplay = this.startAutoplayWorking;
            if (this._runningAnimations === 0) this.startAutoplay();
        }
    });

})(njQuery, window);;
(function ($, scope, undefined) {

    scope.ssLayers = NClass.extend({
        slide: null,
        $slide: null,
        layers: null,
        init: function (slider, slide, options) {
            var _this = this;
            this.options = {};

            this.slider = slider;
            this.slide = slide;
            this.$slide = $(slide);

            $.extend(this.options, options);

            this.refresh();

            this.$slide.on('ssanimatelayersin',function () {
                _this.animateIn();
            }).on('ssanimatelayerssetinstart',function () {
                    _this.setInStart();
                }).on('ssanimatelayerssetoutstart',function () {
                    _this.setOutStart();
                }).on('ssanimatelayersresetin',function () {
                    _this.resetIn();
                }).on('ssanimatelayersresetout',function () {
                    _this.resetOut();
                }).on('ssanimatelayersout',function () {
                    _this.animateOut();
                }).on('ssanimatestop', function () {
                    _this.stop();
                });
        },
        refresh: function () {
            var _this = this;

            this.layers = $([]);

            var _layers = $('.smart-slider-layer', this.slide);
            /*
             this.mainlayer = _layers.filter('.smart-slider-main-layer');
             if (!this.options.mainlayer) {
             _layers = _layers.not(this.mainlayer);
             }

             this.$slide.data('ssmainlayer', this.mainlayer);
             */
            _layers.each(function () {
                var $layer = $(this);
                if ($layer.data('animation') !== undefined) {
                    $layer.css('display', 'none');
                    _this.layers.push(this);
                    $layer.data('slide', _this.slide);
                    $layer.data('layermanager', _this);

                    var motionin = _this.getMotionIn($layer);
                    $layer.data('motionin', motionin);
                    var motionout = _this.getMotionOut($layer);
                    $layer.data('motionout', motionout);

                    if (window.ssadmin === 1) {
                        motionout.setOutStart();
                        motionout.reset();
                        motionin.reset();
                    }
                }
            });
            return this;
        },
        stop: function () {
            this.layers.each(function () {
                $(this).data('motionin').stop();
                $(this).data('motionout').stop();
            });
            return this;
        },
        resetIn: function () {
            this.layers.each(function () {
                $(this).data('motionin').reset();
            });
            return this;
        },
        resetOut: function () {
            this.layers.each(function () {
                $(this).data('motionout').reset();
            });
            return this;
        },
        animateIn: function () {
            if (this.layers.length === 0) {
                $(this.slide).trigger('noanimation');
            } else {
                this.layers.each(function () {
                    $(this).data('motionin').animateIn();
                });
            }
            return this;
        },
        setInStart: function () {
            this.layers.each(function () {
                $(this).data('motionout').setOutStart();
                $(this).data('motionin').setInStart();
            });
            return this;
        },
        animateOut: function () {
            if (this.layers.length === 0) {
                $(this.slide).trigger('noanimation');
            } else {
                this.layers.each(function () {
                    $(this).data('motionout').animateOut();
                });
            }
            return this;
        },
        setOutStart: function () {
            this.layers.each(function () {
                $(this).data('motionout').setOutStart();
            });
            return this;
        },
        setHiddenState: function () {
            this.layers.each(function () {
                $(this).data('motionout').setHiddenState();
            });
            return this;
        },
        getMotionIn: function ($layer) {
            var options = this.options;
            return ssAnimationManager.getAnimation($layer.data('animationin'), $layer, {
                width: options.width,
                height: options.height,
                intervalIn: parseInt($layer.data('durationin')),
                easingIn: $layer.data('easingin'),
                delayIn: parseInt($layer.data('delayin')),
                parallaxIn: parseFloat($layer.data('parallaxin'))
            });
        },
        getMotionOut: function ($layer) {
            var options = this.options;
            return ssAnimationManager.getAnimation($layer.data('animationout'), $layer, {
                width: options.width,
                height: options.height,
                intervalOut: parseInt($layer.data('durationout')),
                easingOut: $layer.data('easingout'),
                delayOut: parseInt($layer.data('delayout')),
                parallaxOut: parseFloat($layer.data('parallaxout'))
            });
        }
    });
})(njQuery, window);(function ($, scope, undefined) {

    scope.ssAnimationNo = scope.ssAnimation.extend({
        init: function (layer, options) {
            this._super(layer, options);
        },
        _setInStart: function () {
            this.layer.css('display', 'block');
        },
        _animateIn: function () {
            this.endFN = 'onAnimateInEnd';
            this.layer.css('display', 'block');
            this['onAnimateInEnd']();
        },
        _animateOut: function () {
            this.endFN = 'onAnimateOutEnd';
            this['onAnimateOutEnd']();
        }
    });

    scope.ssAnimationManager.addAnimation('no', scope.ssAnimationNo, {});

})(njQuery, window);(function ($, scope, undefined) {
    scope.ssAnimationFade = scope.ssAnimation.extend({
        timeout: null,
        init: function (layer, options) {
            this._super(layer, options);
            this.options.animate += " smart-slider-animate-fade";
        },
        _stop: function () {
            var $this = this,
                slider = $(this.layer.data('layermanager').slider);
            slider.on('mainanimationend.layerstop', function () {
                if ($this.timeout) clearTimeout($this.timeout);
                $this.layer.stop(true).css('display', 'none');
                slider.off('mainanimationend.layerstop');
            });
        },
        _setHiddenState: function () {
            this.layer.css('opacity', '1');
        },
        _setInStart: function () {
            this.layer.css('display', 'none');
        },
        _animateIn: function () {
            this._animate(0, 1, this.options.animate + ' ' + this.options.animateIn, this.options.intervalIn, this.options.easingIn, this.options.delayIn, 'onAnimateInEnd');
        },
        _setOutStart: function () {
            this.layer.css('display', 'block').css('opacity', '1');
        },
        _animateOut: function () {
            this._animate(1, 0, this.options.animate + ' ' + this.options.animateOut, this.options.intervalOut, this.options.easingOut, this.options.delayOut, 'onAnimateOutEnd');
        },
        _animate: function (startOpacity, endOpacity, cssclass, interval, easing, delay, endfn) {
            this.endFN = endfn;
            if (this.timeout) clearTimeout(this.timeout);
            var $this = this;
            var endDisplay = (endOpacity === 0) ? 'none' : 'block';

            this.layer.addClass(cssclass).css('opacity', startOpacity).css('display', 'block');

            this.timeout = setTimeout(function () {
                $this.layer.animate({
                    opacity: endOpacity
                }, {
                    duration: interval,
                    complete: function () {
                        $this.layer.css('display', endDisplay).removeClass(cssclass);
                        $this[endfn]();
                    }
                });
            }, 50 + delay);
        }
    });

    scope.ssAnimationManager.addAnimation('fade', scope.ssAnimationFade, {});

})(njQuery, window);(function ($, scope, undefined) {
    scope.ssAnimationSlide = scope.ssAnimation.extend({
        timeout: null,
        delayfnstring: '',
        init: function (layer, options) {
            var _this = this;
            if (!options.target) options.target = {};
            this._super(layer, options);
            this.options.animate += " smart-slider-animate-slide";

            var l = layer[0];
            l.origLeftPercent = parseFloat(l.style.left);
            l.origTopcent = parseFloat(l.style.top);
            if (!l.origLeftPercent) l.origLeftPercent = 0;
            if (!l.origTopcent) l.origTopcent = 0;

            var layermanager = $(this.layer).data('layermanager');
            if (layermanager) {
                $(layermanager.slider).on('resize', function (e, ratio, width, height) {
                    _this.onResize(ratio, width, height);
                });
            }
        },
        _stop: function () {
            var $this = this,
                slider = $(this.layer.data('layermanager').slider);
            window[$this.delayfnstring] = null;
            try {
                delete window[$this.delayfnstring];
            } catch (e) {
            }
            if (this.timeout) clearTimeout(this.timeout);
            slider.on('mainanimationend.layerstop', function () {
                $this.layer.css('display', 'none').stop(true);
                slider.off('mainanimationend.layerstop');
            });
        },
        onResize: function (ratio, width, height) {
            this.options.width = width;
            this.options.height = height;
        },
        _setInStart: function () {
            var coords = this.getCoords(this.options.mode, this.options.parallaxIn, false);
            var left = this.layer[0].origLeftPercent / 100 * this.options.width;
            var top = this.layer[0].origTopcent / 100 * this.options.height;
            this.layer.css('visibility', 'hidden')
            .css('left', left + coords.origX)
                .css('top', top + coords.origY);
        },
        _animateIn: function () {
            this._animate(this.getCoords(this.options.mode, this.options.parallaxIn, false), 'hidden', 'block', 'block', this.options.animate + ' ' + this.options.animateIn, this.options.intervalIn, this.options.easingIn, this.options.delayIn, 'onAnimateInEnd');
        },
        _setOutStart: function () {
            this.layer.css('left', this.layer[0].origLeftPercent + '%')
                .css('top', this.layer[0].origTopcent + '%')
                .css('display', 'block');
        },
        _animateOut: function () {
            this._animate(this.getCoords(this.options.mode, this.options.parallaxOut, true), 'visible', 'block', 'none', this.options.animate + ' ' + this.options.animateOut, this.options.intervalOut, this.options.easingOut, this.options.delayOut, 'onAnimateOutEnd');
        },
        _animate: function (coords, startVisibility, startDisplay, endDisplay, cssclass, interval, easing, delay, endfn) {
            this.endFN = endfn;
            var $this = this,
                options = this.options;
            var left = this.layer[0].origLeftPercent / 100 * options.width;
            var top = this.layer[0].origTopcent / 100 * options.height;
            this.layer.addClass(cssclass).css('left', left + coords.origX).css('top', top + coords.origY).css('visibility', startVisibility).css('display', startDisplay);

            var target = {};
            $.extend(target, this.options.target);
            if (coords.targetX !== null) target.left = left + coords.targetX;
            if (coords.targetY !== null) target.top = top + coords.targetY;


            if (typeof $.easing[easing] != 'function') easing = 'linear';

            var delay = 50 + delay,
                delaystring = 'sstimer' + delay,
                delayfnstring = delaystring + 'fns';

            this.delayfnstring = delayfnstring;
            if (!window[delayfnstring]) window[delayfnstring] = [];
            window[delayfnstring].push(function () {
                $this.layer.css('visibility', 'visible').animate(target, {
                    duration: interval,
                    easing: easing,
                    complete: function () {
                        $this.layer.css('display', endDisplay).removeClass(cssclass).css('left', $this.layer[0].origLeftPercent + '%').css('top', $this.layer[0].origTopcent + '%');
                        $this[endfn]();
                    }
                });
            });

            if (window[delaystring]) clearTimeout(window[delaystring]);
            this.timeout = window[delaystring] = setTimeout(function () {
                for (var i = 0; i < window[delayfnstring].length; i++) {
                    window[delayfnstring][i]();
                }
                window[delayfnstring] = null;
                try {
                    delete window[delayfnstring];
                } catch (e) {
                }
            }, delay);
        },
        getCoords: function (direction, parallax, out) {
            var coords = {
                targetX: null,
                targetY: null,
                origX: 0,
                origY: 0
            }, options = this.options;
            if (out) {
                switch (direction) {
                    case 'righttoleft':
                        coords.origX = 0;
                        coords.targetX = -1 * options.width * parallax;
                        break;
                    case 'lefttoright':
                        coords.origX = 0;
                        coords.targetX = options.width * parallax;
                        break;
                    case 'toptobottom':
                        coords.origY = 0;
                        coords.targetY = options.height * parallax;
                        break;
                    case 'bottomtotop':
                        coords.origY = 0;
                        coords.targetY = -1 * options.height * parallax;
                        break;
                    default:
                }
            } else {
                switch (direction) {
                    case 'righttoleft':
                        coords.origX = options.width * parallax;
                        coords.targetX = 0;
                        break;
                    case 'lefttoright':
                        coords.origX = -1 * options.width * parallax;
                        coords.targetX = 0;
                        break;
                    case 'toptobottom':
                        coords.origY = -1 * options.height * parallax;
                        coords.targetY = 0;
                        break;
                    case 'bottomtotop':
                        coords.origY = options.height * parallax;
                        coords.targetY = 0;
                        break;
                    default:
                }
            }
            return coords;
        }
    });

    scope.ssAnimationManager.addAnimation('slidelefttoright', scope.ssAnimationSlide, {
        mode: 'lefttoright'
    });

    scope.ssAnimationManager.addAnimation('sliderighttoleft', scope.ssAnimationSlide, {
        mode: 'righttoleft'
    });

    scope.ssAnimationManager.addAnimation('slidetoptobottom', scope.ssAnimationSlide, {
        mode: 'toptobottom'
    });

    scope.ssAnimationManager.addAnimation('slidebottomtotop', scope.ssAnimationSlide, {
        mode: 'bottomtotop'
    });

})(njQuery, window);(function ($, scope, undefined) {
    scope.ssAnimationTransit = scope.ssAnimation.extend({
        timeout: null,
        init: function (layer, options) {
            var _this = this;
            //$.transit.useTransitionEnd = true;
            this._super(layer, options);
            this.options.animate += " smart-slider-animate-slide";

        },
        reset: function () {
            if (this.options.reset) {
                this.layer.css(this.options.reset);
            }
        },
        _stop: function () {
            if (this.timeout) clearTimeout(this.timeout);
            var $this = this,
                slider = $(this.layer.data('layermanager').slider);
            slider.on('mainanimationend.layerstop', function () {
                $this.layer.transitionStop(true).css('display', 'none');
                slider.off('mainanimationend.layerstop');
            });
        },
        _setInStart: function () {
            this.layer.css('visibility', 'hidden').css(this.options.startCSS);
        },
        _animateIn: function () {
            this._animate(this.options.animationin, $.extend({}, this.options.startCSS), $.extend({}, this.options.endCSS), 'hidden', 'block', 'block', this.options.animate + ' ' + this.options.animateIn, this.options.intervalIn, this.options.easingIn, this.options.delayIn, this.options.parallaxIn, 'onAnimateInEnd');
        },
        _setOutStart: function () {
            this.layer.css(this.options.endCSS).css('display', 'block');
        },
        _animateOut: function () {
            this._animate(this.options.animationout, $.extend({}, this.options.endCSS), $.extend({}, this.options.startCSS), 'visible', 'block', 'block', this.options.animate + ' ' + this.options.animateOut, this.options.intervalOut, this.options.easingOut, this.options.delayOut, this.options.parallaxOut, 'onAnimateOutEnd');
        },
        _animate: function (animation, startcss, endcss, startVisibility, startDisplay, endDisplay, cssclass, interval, easing, delay, parallax, endfn) {
            this.endFN = endfn;
            var $this = this,
                options = this.options;
            var left = this.layer[0].origLeftPercent / 100 * options.width;
            var top = this.layer[0].origTopcent / 100 * options.height;

            if (this.options.parallax) {
                for (var i = 0; i < this.options.parallax.length; i++) {
                    var prop = this.options.parallax[i];
                    startcss[prop] *= parallax;
                    endcss[prop] *= parallax;
                }
            }

            this.layer.addClass(cssclass).css('visibility', startVisibility).css(startcss).css('display', startDisplay);


            if (typeof $.easing[easing] != 'function') easing = 'linear';

            this.timeout = setTimeout(function () {
                var layer = $this.layer,
                    percent = 0;
                if (animation && animation.length > 0) {
                    for (var i = 0; i < animation.length; i++) {
                        layer.css('visibility', 'visible').transition(
                            animation[i].css,
                            interval * (animation[i].percent - percent) / 100,
                            easing
                        );
                        percent = animation[i].percent;
                    }
                }
                layer.css('visibility', 'visible').transition(
                    endcss,
                    interval * (100 - percent) / 100,
                    easing,
                    function () {
                        $this.layer.css('display', endDisplay).removeClass(cssclass);
                        $this[endfn]();
                    }
                );
            }, 50 + parseInt(delay));

        }
    });

    scope.ssAnimationManager.addAnimation('flipx', scope.ssAnimationTransit, {
        startCSS: {
            opacity: 0,
            perspective: '400px',
            rotateX: 90
        },
        animationin: [
            {
                percent: 40,
                css: {
                    opacity: 0.4,
                    rotateX: -10
                }
            },
            {
                percent: 70,
                css: {
                    opacity: 0.7,
                    rotateX: 10
                }
            }
        ],
        endCSS: {
            opacity: 1,
            rotateX: 0
        }
    });

    scope.ssAnimationManager.addAnimation('flipy', scope.ssAnimationTransit, {
        startCSS: {
            opacity: 0,
            perspective: '400px',
            rotateY: 90
        },
        animationin: [
            {
                percent: 40,
                css: {
                    opacity: 0.4,
                    rotateY: -10
                }
            },
            {
                percent: 70,
                css: {
                    opacity: 0.7,
                    rotateY: 10
                }
            }
        ],
        endCSS: {
            opacity: 1,
            rotateY: 0
        }
    });

    scope.ssAnimationManager.addAnimation('fadeup', scope.ssAnimationTransit, {
        startCSS: {
            opacity: 0,
            y: 1000
        },
        endCSS: {
            opacity: 1,
            y: 0
        },
        parallax: ['x']
    });

    scope.ssAnimationManager.addAnimation('faderight', scope.ssAnimationTransit, {
        startCSS: {
            opacity: 0,
            x: 1000
        },
        endCSS: {
            opacity: 1,
            x: 0
        },
        parallax: ['x']
    });

    scope.ssAnimationManager.addAnimation('fadedown', scope.ssAnimationTransit, {
        startCSS: {
            opacity: 0,
            y: -1000
        },
        endCSS: {
            opacity: 1,
            y: 0
        },
        parallax: ['x']
    });

    scope.ssAnimationManager.addAnimation('fadeleft', scope.ssAnimationTransit, {
        startCSS: {
            opacity: 0,
            x: -1000
        },
        endCSS: {
            opacity: 1,
            x: 0
        },
        parallax: ['x']
    });

    scope.ssAnimationManager.addAnimation('bounce', scope.ssAnimationTransit, {
        startCSS: {
            opacity: 0,
            scale: 0
        },
        animationin: [
            {
                percent: 50,
                css: {
                    opacity: 1,
                    scale: 1.05
                }
            },
            {
                percent: 70,
                css: {
                    scale: 0.9
                }
            }
        ],
        endCSS: {
            opacity: 1,
            scale: 1
        }
    });

    scope.ssAnimationManager.addAnimation('rotate', scope.ssAnimationTransit, {
        startCSS: {
            transformOrigin: 'center center',
            rotate: -360
        },
        endCSS: {
            transformOrigin: 'center center',
            rotate: 0
        },
        parallax: ['rotate']
    });

    scope.ssAnimationManager.addAnimation('rotateupleft', scope.ssAnimationTransit, {
        startCSS: {
            transformOrigin: 'left bottom',
            rotate: 90
        },
        endCSS: {
            transformOrigin: 'left bottom',
            rotate: 0
        },
        parallax: ['rotate']
    });

    scope.ssAnimationManager.addAnimation('rotatedownleft', scope.ssAnimationTransit, {
        startCSS: {
            transformOrigin: 'left bottom',
            rotate: -90
        },
        endCSS: {
            transformOrigin: 'left bottom',
            rotate: 0
        },
        parallax: ['rotate']
    });

    scope.ssAnimationManager.addAnimation('rotateupright', scope.ssAnimationTransit, {
        startCSS: {
            transformOrigin: 'right bottom',
            rotate: 90
        },
        endCSS: {
            transformOrigin: 'right bottom',
            rotate: 0
        },
        parallax: ['rotate']
    });

    scope.ssAnimationManager.addAnimation('rotatedownright', scope.ssAnimationTransit, {
        startCSS: {
            transformOrigin: 'right bottom',
            rotate: -90
        },
        endCSS: {
            transformOrigin: 'right bottom',
            rotate: 0
        },
        parallax: ['rotate']
    });

    scope.ssAnimationManager.addAnimation('rollin', scope.ssAnimationTransit, {
        startCSS: {
            transformOrigin: 'center center',
            opacity: 0,
            x: '-100%',
            rotate: -360
        },
        endCSS: {
            transformOrigin: 'center center',
            opacity: 1,
            x: 0,
            rotate: 0
        },
        parallax: ['rotate']
    });

    scope.ssAnimationManager.addAnimation('rollout', scope.ssAnimationTransit, {
        startCSS: {
            transformOrigin: 'center center',
            opacity: 0,
            x: '100%',
            rotate: 360
        },
        endCSS: {
            transformOrigin: 'center center',
            opacity: 1,
            x: 0,
            rotate: 0
        },
        parallax: ['rotate']
    });

    scope.ssAnimationManager.addAnimation('scale', scope.ssAnimationTransit, {
        startCSS: {
            transformOrigin: 'center center',
            scale: 0
        },
        endCSS: {
            transformOrigin: 'center center',
            scale: 1
        }
    });

    scope.ssAnimationManager.addAnimation('kenburnsleftbottom', scope.ssAnimationTransit, {
        startCSS: {
            transformOrigin: 'bottom left',
            x: 0,
            scale: 1
        },
        endCSS: {
            transformOrigin: 'bottom left',
            x: -70,
            scale: 1.5
        },
        reset: {
            x: 0,
            scale: 1
        },
        parallax: ['x']
    });

    scope.ssAnimationManager.addAnimation('kenburnslefttop', scope.ssAnimationTransit, {
        startCSS: {
            transformOrigin: 'top left',
            x: 0,
            scale: 1
        },
        endCSS: {
            transformOrigin: 'top left',
            x: -70,
            scale: 1.5
        },
        reset: {
            x: 0,
            scale: 1
        },
        parallax: ['x']
    });

    scope.ssAnimationManager.addAnimation('kenburnsrightbottom', scope.ssAnimationTransit, {
        startCSS: {
            transformOrigin: 'bottom right',
            x: 0,
            scale: 1
        },
        endCSS: {
            transformOrigin: 'bottom right',
            x: 70,
            scale: 1.5
        },
        reset: {
            x: 0,
            scale: 1
        },
        parallax: ['x']
    });

    scope.ssAnimationManager.addAnimation('kenburnsrighttop', scope.ssAnimationTransit, {
        startCSS: {
            transformOrigin: 'top right',
            x: 0,
            scale: 1
        },
        endCSS: {
            transformOrigin: 'top right',
            x: 70,
            scale: 1.5
        },
        reset: {
            x: 0,
            scale: 1
        },
        parallax: ['x']
    });
	
	
	
	
	
	
	
    scope.ssAnimationManager.addAnimation('zoomoutfromtop', scope.ssAnimationTransit, {
        startCSS: {
            transformOrigin: 'top',
            x: 0,
            scale: 1.5
        },
        endCSS: {
            transformOrigin: 'top',
            x: 0,
            scale: 1.0
        },
        reset: {
            x: 0,
            scale: 1
        },
        parallax: ['x']
    });
	
    scope.ssAnimationManager.addAnimation('zoomoutfromleft', scope.ssAnimationTransit, {
        startCSS: {
            transformOrigin: 'left',
            x: 0,
            scale: 1.5
        },
        endCSS: {
            transformOrigin: 'left',
            x: 0,
            scale: 1.0
        },
        reset: {
            x: 0,
            scale: 1
        },
        parallax: ['x']
    });
	
    scope.ssAnimationManager.addAnimation('zoomoutfrombottom', scope.ssAnimationTransit, {
        startCSS: {
            transformOrigin: 'bottom',
            x: 0,
            scale: 1.5
        },
        endCSS: {
            transformOrigin: 'bottom',
            x: 0,
            scale: 1.0
        },
        reset: {
            x: 0,
            scale: 1
        },
        parallax: ['x']
    });
	
    scope.ssAnimationManager.addAnimation('zoomoutfromright', scope.ssAnimationTransit, {
        startCSS: {
            transformOrigin: 'right',
            x: 0,
            scale: 1.5
        },
        endCSS: {
            transformOrigin: 'right',
            x: 0,
            scale: 1.0
        },
        reset: {
            x: 0,
            scale: 1
        },
        parallax: ['x']
    });
	
	
	
	
	

    scope.ssAnimationManager.addAnimation('zoomoutfromrighttop', scope.ssAnimationTransit, {
        startCSS: {
            transformOrigin: 'top right',
            x: 0,
            scale: 1.5
        },
        endCSS: {
            transformOrigin: 'top right',
            x: 0,
            scale: 1.0
        },
        reset: {
            x: 0,
            scale: 1
        },
        parallax: ['x']
    });
	
    scope.ssAnimationManager.addAnimation('zoomoutfromlefttop', scope.ssAnimationTransit, {
        startCSS: {
            transformOrigin: 'top left',
            x: 0,
            scale: 1.5
        },
        endCSS: {
            transformOrigin: 'top left',
            x: 0,
            scale: 1.0
        },
        reset: {
            x: 0,
            scale: 1
        },
        parallax: ['x']
    });
	
    scope.ssAnimationManager.addAnimation('zoomoutfromleftbottom', scope.ssAnimationTransit, {
        startCSS: {
            transformOrigin: 'bottom left',
            x: 0,
            scale: 1.5
        },
        endCSS: {
            transformOrigin: 'bottom left',
            x: 0,
            scale: 1.0
        },
        reset: {
            x: 0,
            scale: 1
        },
        parallax: ['x']
    });
	
    scope.ssAnimationManager.addAnimation('zoomoutfromrightbottom', scope.ssAnimationTransit, {
        startCSS: {
            transformOrigin: 'bottom right',
            x: 0,
            scale: 1
        },
        endCSS: {
            transformOrigin: 'bottom right',
            x: 0,
            scale: 1.0
        },
        reset: {
            x: 0,
            scale: 1
        },
        parallax: ['x']
    });

})(njQuery, window);(function ($, scope, undefined) {
    scope.ssSimpleSlider = scope.ssTypeBase.extend({
        extraParallax: 1,
        init: function (parent, $el, options) {
            var _this = this;

            options.flux[0] = (options.flux[0] && parseInt(options.flux[0])) ? true : false;

            this._super(parent, $el, options);

            this.smartsliderborder2 = $el.find('.smart-slider-border2');

            this.$this.on('mainanimationoutend', function () {
                var $slide = this.slideList.eq(_this._lastActive);
                $slide.css('display', 'none');
            });
            $(this).on('load.firstsub', function () {
                $(this).off('load.firstsub');
            });
        },
        sizeInited: function () {
            if (this.options.flux[0]) {
                this.flux = new flux.slider('.nextend-flux', {
                    transitions: this.options.flux[1],
                    width: this.slideDimension.w,
                    height: this.slideDimension.h,
                    currentImageIndex: this._active,
                    nextImageIndex: this._active + 1
                });
            }
        },
        storeDefaults: function () {
            var _this = this,
                ss = this.$slider;

            ss.data('ss-outerwidth', ss.outerWidth(true));

            ss.data('ss-fontsize', parseInt(ss.css('fontSize')));

            ss.data('ss-m-t', parseInt(ss.css('marginTop')));
            ss.data('ss-m-r', parseInt(ss.css('marginRight')));
            ss.data('ss-m-b', parseInt(ss.css('marginBottom')));
            ss.data('ss-m-l', parseInt(ss.css('marginLeft')));
            ss.data('ss-w', ss.width());
            ss.data('ss-h', ss.height());

            var smartsliderborder1 = this.smartsliderborder1 = ss.find('.smart-slider-border1');

            smartsliderborder1.data('ss-w', smartsliderborder1.width());
            smartsliderborder1.data('ss-h', smartsliderborder1.height());
            smartsliderborder1.data('ss-p-t', parseInt(smartsliderborder1.css('paddingTop')));
            smartsliderborder1.data('ss-p-r', parseInt(smartsliderborder1.css('paddingRight')));
            smartsliderborder1.data('ss-p-b', parseInt(smartsliderborder1.css('paddingBottom')));
            smartsliderborder1.data('ss-p-l', parseInt(smartsliderborder1.css('paddingLeft')));

            var canvases = this.smartslidercanvasinner = this.slideList.find('.smart-slider-canvas-inner');
            canvases.data('ss-w', canvases.width());
            canvases.data('ss-h', canvases.height());

            this.slideList.css({
                width: canvases.data('ss-w'),
                height: canvases.data('ss-h')
            });
            
            this.imagesinited = false;
            this.$slider.waitForImages(function () {
                $.each(_this.slidebgList, function(){
                    var $img = $(this);
                    var im = $("<img/>").attr("src", $img.attr("src"));
                    $img.data('ss-w', im[0].width);
                    $img.data('ss-h', im[0].height);
                });
                _this.imagesinited = true;
                _this.$slider.trigger('imagesinited');
            });


        },
        onResize: function () {
            var _this = this,
                ss = this.$slider;

            var ratio = 1;

            var availableWidth = ss.parent().width();

            var outerWidth = ss.data('ss-outerwidth');

            if (!this.options.responsive.upscale && availableWidth > outerWidth) availableWidth = outerWidth;

            if (availableWidth != outerWidth) {
                ratio = availableWidth / outerWidth;
            }

            if (this.lastAvailableWidth == availableWidth || !this.options.responsive.downscale && ratio < 1) {
                var _this = this;
                this.$slider.waitForImages(function () {
                    $(_this).trigger('load');
                });
                return true;
            }

            this.lastAvailableWidth = availableWidth;

            ss.css('fontSize', ss.data('ss-fontsize') * ratio + 'px');

            ss.css('marginTop', parseInt(ss.data('ss-m-t') * ratio) + 'px');
            ss.css('marginRight', parseInt(ss.data('ss-m-r') * ratio) + 'px');
            ss.css('marginBottom', parseInt(ss.data('ss-m-b') * ratio) + 'px');
            ss.css('marginLeft', parseInt(ss.data('ss-m-l') * ratio) + 'px');

            var smartsliderborder1 = this.smartsliderborder1;


            smartsliderborder1.css('paddingTop', parseInt(smartsliderborder1.data('ss-p-t') * ratio) + 'px');
            smartsliderborder1.css('paddingRight', parseInt(smartsliderborder1.data('ss-p-r') * ratio) + 'px');
            smartsliderborder1.css('paddingBottom', parseInt(smartsliderborder1.data('ss-p-b') * ratio) + 'px');
            smartsliderborder1.css('paddingLeft', parseInt(smartsliderborder1.data('ss-p-l') * ratio) + 'px');

            smartsliderborder1.width(parseInt(smartsliderborder1.data('ss-w') * ratio));


            ss.width(smartsliderborder1.outerWidth(true));


            var canvases = this.smartslidercanvasinner;
            var oCanvasWidth = canvasWidth = parseInt(canvases.data('ss-w') * ratio),
                oCanvasHeight = parseInt(canvases.data('ss-h') * ratio),
                margin = 0,
                maxw = this.options.responsive.maxwidth,
                ratio2 = ratio;

            if (canvasWidth > this.options.responsive.maxwidth) {
                margin = parseInt((canvasWidth - maxw) / 2);
                ratio2 = maxw / canvases.data('ss-w');
                canvasWidth = parseInt(canvases.data('ss-w') * ratio2);
            }

            this.extraParallax = ratio / ratio2;

            var canvasHeight = parseInt(canvases.data('ss-h') * ratio2);
            
            if (this.options.flux[0]) this.flux.changeSize(oCanvasWidth, canvasHeight);

            canvases.width(canvasWidth).height(canvasHeight).css({
                marginLeft: margin,
                marginRight: margin
            });

            this.slideList.css({
                width: canvases.outerWidth(true),
                height: canvases.outerHeight(true)
            });

            smartsliderborder1.css('fontSize', ss.data('ss-fontsize') * ratio2 + 'px');

            smartsliderborder1.height(canvasHeight);
            ss.height(smartsliderborder1.outerHeight(true));

            this.slideDimension.w = canvasWidth;
            this.slideDimension.h = canvasHeight;

            
            this.slidebgList.width(oCanvasWidth);
            var bgfn = function () {
                $.each(_this.slidebgList, function(){
                    var $img = $(this);
                    $img.height(parseInt(oCanvasWidth/$img.data('ss-w')*$img.data('ss-h')));
                });
            };
            if(_this.imagesinited){
                bgfn();
            }else{
                _this.$slider.on('imagesinited', function(){
                    bgfn();
                });
            }


            for (var i = 0; i < window[this.id + '-onresize'].length; i++) {
                window[this.id + '-onresize'][i](ratio);
            }
            $(this).trigger('resize', [ratio, canvasWidth, canvasHeight]);

            var _this = this;
            this.$slider.waitForImages(function () {
                $(_this).trigger('load');
            });
        },
        animateOut: function (i, reversed) {
            var _this = this;
            this._lastActive = i;

            this.initAnimation();

            var $slide = this.slideList.eq(i);
            $slide.on('ssanimationsended.ssmainanimateout',function () {
                $slide.off('ssanimationsended.ssmainanimateout');
                _this.$this.trigger('mainanimationoutend');
                _this.mainanimationended();
            }).trigger('ssoutanimationstart');
            this.__animateOut($slide, reversed).animateOut();
        },
        animateIn: function (i, reversed) {
            this._active = i;
            var _this = this,
                $slide = this.slideList.eq(i);

            $slide.width(this.slideList.width());
            $slide.on('ssanimationsended.ssmainanimatein',function () {
                $slide.off('ssanimationsended.ssmainanimatein');
                _this.$this.trigger('mainanimationinend');
                _this.mainanimationended();
            }).trigger('ssinanimationstart');

            if (this.options.flux[0]) {
                $slide.trigger('incrementanimation');
                this.__animateIn($slide, reversed,function () {
                }).animateIn();
                this.flux.element.on('fluxTransitionEnd.ss', function (event) {
                    $(this).off('fluxTransitionEnd.ss');
                    _this.mainanimationended();
                    $slide.trigger('decrementanimation');
                });
                this.flux.showImage(i);
            } else {
                this.__animateIn($slide, reversed,function () {
                    _this.mainanimationended();
                }).animateIn();
            }
        },

        initAnimation: function () {
            var currentAnimation = this.options.animation[Math.floor(Math.random() * this.options.animation.length)];
            this._animationOptions = {
                next: {},
                current: {}
            };

            this._animationOptions.next = $.merge(this.options.animationSettings, this._animationOptions.next);
            this._animationOptions.current = $.merge(this.options.animationSettings, this._animationOptions.current);

            switch (currentAnimation) {
                case 'horizontal':
                    this.__animateIn = this.__animateInHorizontal;
                    this.__animateOut = this.__animateOutHorizontal;
                    break;
                case 'vertical':
                    this.__animateIn = this.__animateInVertical;
                    this.__animateOut = this.__animateOutVertical;
                    break;
                case 'fade':
                    this.__animateIn = this.__animateInFade;
                    this.__animateOut = this.__animateOutFade;
                    break;
                default:
                    this.__animateIn = this.__animateInNo;
                    this.__animateOut = this.__animateOutNo;
                    break;
            }
        },

        __animateIn: function ($slide, reversed, end) {

        },

        __animateOut: function ($slide, reversed, end) {

        },

        __animateInNo: function ($slide, reversed, end) {
            if (end) end();
            return ssAnimationManager.getAnimation('no', $slide, {});
        },

        __animateOutNo: function ($slide, reversed, end) {
            if (end) end();
            return ssAnimationManager.getAnimation('no', $slide, {});
        },

        __animateInHorizontal: function ($slide, reversed, end) {

            var option = this._animationOptions.next;
            return ssAnimationManager.getAnimation((reversed && option.parallax >= 1) ? 'slidelefttoright' : 'sliderighttoleft', $slide, {
                width: this.slideDimension.w,
                height: this.slideDimension.h,
                intervalIn: option.duration,
                easingIn: option.easing,
                delayIn: option.delay,
                parallaxIn: option.parallax * this.extraParallax,
                target: {},
                endFn: function () {
                    if (end) end();
                }
            });
        },

        __animateOutHorizontal: function ($slide, reversed, end) {

            var _this = this,
                option = this._animationOptions.current,
                target = option.parallax < 1 ? {width: this.smartsliderborder2.width() * option.parallax} : {};

            return ssAnimationManager.getAnimation((reversed && option.parallax >= 1) ? 'slidelefttoright' : 'sliderighttoleft', $slide, {
                width: this.slideDimension.w,
                height: this.slideDimension.h,
                intervalOut: option.duration,
                easingOut: option.easing,
                delayOut: option.delay,
                parallaxOut: option.parallax * this.extraParallax,
                target: target,
                endFn: function () {
                    $slide.width(_this.smartsliderborder2.width());
                    if (end) end();
                }
            });
        }
    });

})(njQuery, window);/**
 *
 *  Base64 encode / decode
 *  http://www.webtoolkit.info/
 *
 **/

var Base64 = {

    // private property
    _keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

    // public method for encoding
    encode : function (input) {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;

        input = Base64._utf8_encode(input);

        while (i < input.length) {

            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);

            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;

            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }

            output = output +
                this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
                this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

        }

        return output;
    },

    // public method for decoding
    decode : function (input) {
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;

        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

        while (i < input.length) {

            enc1 = this._keyStr.indexOf(input.charAt(i++));
            enc2 = this._keyStr.indexOf(input.charAt(i++));
            enc3 = this._keyStr.indexOf(input.charAt(i++));
            enc4 = this._keyStr.indexOf(input.charAt(i++));

            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;

            output = output + String.fromCharCode(chr1);

            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }

        }

        output = Base64._utf8_decode(output);

        return output;

    },

    // private method for UTF-8 encoding
    _utf8_encode : function (string) {
        string = string.replace(/\r\n/g,"\n");
        var utftext = "";

        for (var n = 0; n < string.length; n++) {

            var c = string.charCodeAt(n);

            if (c < 128) {
                utftext += String.fromCharCode(c);
            }
            else if((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            }
            else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }

        }

        return utftext;
    },

    // private method for UTF-8 decoding
    _utf8_decode : function (utftext) {
        var string = "";
        var i = 0;
        var c = c1 = c2 = 0;

        while ( i < utftext.length ) {

            c = utftext.charCodeAt(i);

            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            }
            else if((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i+1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            }
            else {
                c2 = utftext.charCodeAt(i+1);
                c3 = utftext.charCodeAt(i+2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }

        }

        return string;
    }

};(function($, undefined) {
    function isOverAxis(x, reference, size) {
        return (x > reference) && (x < (reference + size));
    }

    function isFloating(item) {
        return (/left|right/).test(item.css("float")) || (/inline|table-cell/).test(item.css("display"));
    }
    $.widget("ui.nextendSortable", $.ui.sortable, {
        _create: function() {
            $.ui.sortable.prototype._create.apply(this, arguments);
            $.data(this.element[0], 'ui-sortable', this);
        },
        _intersectsWith: function(item) {
            var pos = $.ui.sortable.prototype._intersectsWith.apply(this, arguments);

            return pos;
        },
        _contactContainers: function(event) {
            var i, j, dist, itemWithLeastDistance, posProperty, sizeProperty, base, cur, nearBottom, floating,
                    innermostContainer = null,
                    innermostIndex = null;

            // get innermost container that intersects with item
            for (i = this.containers.length - 1; i >= 0; i--) {

                // never consider a container that's located within the item itself
                if ($.contains(this.currentItem[0], this.containers[i].element[0])) {
                    continue;
                }

                if (this._intersectsWith(this.containers[i].containerCache)) {

                    // if we've already found a container and it's more "inner" than this, then continue
                    //if (innermostContainer && $.contains(this.containers[i].element[0], innermostContainer.element[0])) {
                    if (innermostContainer && parseInt(this.containers[i].element.css('zIndex')) < parseInt(innermostContainer.element.css('zIndex'))) {
                        if(window.ssdrag){
                            innermostContainer = window.dummySortable;
                            innermostIndex = this.containers.indexOf(innermostContainer);
                        }
                        continue;
                    }

                    innermostContainer = this.containers[i];
                    innermostIndex = i;

                } else {
                    // container doesn't intersect. trigger "out" event if necessary
                    if (this.containers[i].containerCache.over) {
                        this.containers[i]._trigger("out", event, this._uiHash(this));
                        this.containers[i].containerCache.over = 0;
                    }
                }

            }
            // if no intersecting containers found, return
            if (!innermostContainer) {
                return;
            }

            // move the item into the container if it's not there already
            if (this.containers.length === 1) {
                if (!this.containers[innermostIndex].containerCache.over) {
                    this.containers[innermostIndex]._trigger("over", event, this._uiHash(this));
                    this.containers[innermostIndex].containerCache.over = 1;
                }
            } else {

                //When entering a new container, we will find the item with the least distance and append our item near it
                dist = 10000;
                itemWithLeastDistance = null;
                floating = innermostContainer.floating || isFloating(this.currentItem);
                posProperty = floating ? "left" : "top";
                sizeProperty = floating ? "width" : "height";
                base = this.positionAbs[posProperty] + this.offset.click[posProperty];
                for (j = this.items.length - 1; j >= 0; j--) {
                    if (!$.contains(this.containers[innermostIndex].element[0], this.items[j].item[0])) {
                        continue;
                    }
                    if (this.items[j].item[0] === this.currentItem[0]) {
                        continue;
                    }
                    if (floating && !isOverAxis(this.positionAbs.top + this.offset.click.top, this.items[j].top, this.items[j].height)) {
                        continue;
                    }
                    cur = this.items[j].item.offset()[posProperty];
                    nearBottom = false;
                    if (Math.abs(cur - base) > Math.abs(cur + this.items[j][sizeProperty] - base)) {
                        nearBottom = true;
                        cur += this.items[j][sizeProperty];
                    }

                    if (Math.abs(cur - base) < dist) {
                        dist = Math.abs(cur - base);
                        itemWithLeastDistance = this.items[j];
                        this.direction = nearBottom ? "up" : "down";
                    }
                }

                //Check if dropOnEmpty is enabled
                if (!itemWithLeastDistance && !this.options.dropOnEmpty) {
                    return;
                }

                if (this.currentContainer === this.containers[innermostIndex]) {
                    return;
                }
                itemWithLeastDistance ? this._rearrange(event, itemWithLeastDistance, null, true) : this._rearrange(event, null, this.containers[innermostIndex].element, true);


                this._trigger("change", event, this._uiHash());
                this.containers[innermostIndex]._trigger("change", event, this._uiHash(this));

                this.currentContainer = this.containers[innermostIndex];

                //Update the placeholder
                this.options.placeholder.update(this.currentContainer, this.placeholder);

                this.containers[innermostIndex]._trigger("over", event, this._uiHash(this));
                this.containers[innermostIndex].containerCache.over = 1;
            }


        }
    });
})(njQuery);;
(function($, scope, undefined) {
    scope.ssadminConsoleClass = NClass.extend({
        timeout: null,
        priority: 1,
        init: function(options) {
            this.c = options.console[0];
            window[options.name] = this;
        },
        set: function(msg, priority, timeout) {
            priority = typeof priority !== 'undefined' ? priority : 1;
            if (this.priority > priority)
                return false;
            
            this.priority = priority;

            timeout = typeof timeout !== 'undefined' ? timeout : 3000;
            if (this.timeout)
                clearTimeout(this.timeout);

            this.c.innerHTML = msg;

            if (timeout != 0) {
                var $this = this;
                this.timeout = setTimeout(function() {
                    $this.c.innerHTML = '';
                    $this.priority = 1;
                }, timeout);
            }
        }
    });

    $(document).ready(function() {
        new scope.ssadminConsoleClass({
            'console': $('.smartslider-slide-console'),
            name: 'slideconsole'
        });
    });
})(njQuery, window);njQuery.fn.ssdata = function (key, value) {
    if (value === null) {
        this.removeAttr('data-' + key);
        return this;
    } else if (value === undefined) {
        return this.attr('data-' + key);
    } else {
        njQuery(this).data(key, value);
        this.attr('data-' + key, value);
        return this;
    }
};
njQuery.fireEvent = function (el, eventName) {
    var event;
    if (document.createEvent) {
        event = document.createEvent('HTMLEvents');
        event.initEvent(eventName, true, true);
    } else if (document.createEventObject) {// IE < 9
        event = document.createEventObject();
        event.eventType = eventName;
    }
    event.eventName = eventName;
    if (el.dispatchEvent) {
        el.dispatchEvent(event);
    } else if (el.fireEvent && htmlEvents['on' + eventName]) {// IE < 9
        el.fireEvent('on' + event.eventType, event);// can trigger only real event (e.g. 'click')
    } else if (el[eventName]) {
        el[eventName]();
    } else if (el['on' + eventName]) {
        el['on' + eventName]();
    }
};

window.ssadmin = 1;

;
(function ($, scope, undefined) {

    window.SmartSliderAdminSlide = function (id, active, hidden, layouturl) {
        scope.adminSlide = new scope.ssadminSlideClass(id, active, hidden, layouturl);
    };


    scope.ssadminSlideClass = NClass.extend({
        ss: null,
        outplayed: false,
        init: function (id, active, hidden, layouturl) {
            var $this = this;

            var ie = this.isIE();
            if(ie && ie < 10){
                alert('The editor was tested under Internet Explorer 10, Firefox and Chrome. Please use one of the tested browser!');
            }
            
            window.nextendtime = $.now();
            window.nextendsave = false;

            this.hidden = $('#' + hidden);
            this.$slider = $('#' + id);
            
            this.initBG();
            
            this.$slide = this.$slider.find('.smart-slider-canvas').eq(active);
            this.editAndList();
            this.ssadminLayers = scope.ssadminLayers = new ssadminLayersClass(this.$slide, this, layouturl);

            $('#smartslider-form').submit(function () {
                if ($this.$slide[0].ssanimation === 0) {
                    $('.smartslider-slide-advanced-layers').remove();
                    $this.hidden.val(Base64.encode($this.ssadminLayers.getHTML()));
                    window.nextendsave = true;
                    return true;
                } else {
                    return false;
                }
            });

            this.initTopbar();
        },
        isIE: function () {
            var myNav = navigator.userAgent.toLowerCase();
            return (myNav.indexOf('msie') != -1) ? parseInt(myNav.split('msie')[1]) : false;
        },
        initBG: function(){
            var $this = this,
                bgimage = this.$slider.find('.nextend-slide-bg'),
                canvas = this.$slider.find('.smart-slider-bg-colored');
            $('#slidebackground').on('change', function(){
                var s = this.value.split('|*|');
                
                if(s[1] == ''){
                    bgimage.css('display', 'none');
                }else{
                    bgimage.css('display', 'block');
                    bgimage.attr('src', s[1]);
                }
                if(s[0].substr(6,8) == '00'){
                    canvas.css('background', '');
                }else{
                    canvas.css('background', '#'+s[0].substr(0,6));
                    canvas.css('background', hex2rgba(s[0]));
                }
            });
        },
        initTopbar: function () {
            var $this = this;

            this.playing = 0;
            this.playbtn = $('.smartslider-toolbar-play').on('click', function () {
                $this.switchPlay();
            });

            this.$slide.on('ssanimationsended', function () {
                setTimeout(function () {
                    $this.playEnded();
                }, 300);
            });
        },
        getSS: function () {
            if (this.ss === null) {
                this.ss = this.$slider.data('smartslider').slider.mainslider;
            }
            return this.ss;
        },
        switchPlay: function () {
            var $this = this;
            if (!this.playing && this.$slide[0].ssanimation === 0) {
                this.playing = 1;
                slideconsole.set('Playing in animations - edit and save disabled', 2, 0);
                this.playbtn.addClass('active');
                var layers = this.$slide[0].layers;
                layers.refresh().setInStart().animateIn();
                setTimeout(function () {
                    $this.playEnded();
                }, 300);
            }
        },
        playOut: function () {
            var $this = this,
                layers = this.$slide[0].layers;
            this.outplayed = true;
            slideconsole.set('Playing out animations - edit and save disabled', 2, 0);
            layers.animateOut();
            setTimeout(function () {
                $this.playEnded();
            }, 300);
        },
        playEnded: function () {
            if (this.$slide[0].ssanimation === 0 && this.playbtn.hasClass('active')) {
                if (this.outplayed === false) {
                    var $this = this;
                    slideconsole.set('In animations ended - edit and save disabled', 2);
                    setTimeout(function () {
                        $this.playOut();
                    }, 2000);
                } else {
                    var layers = this.$slide[0].layers;
                    layers.refresh().resetOut().resetIn();
                    this.outplayed = false;
                    this.playbtn.removeClass('active');
                    slideconsole.set('Animations ended - edit and save enabled', 2);
                    this.playing = 0;
                }
            }
        },
        editAndList: function () {
            var $toolbox = $('#smartslider-slide-toolbox'),
                $list = $('.smartslider-toolbar-list'),
                $edit = $('.smartslider-toolbar-edit'),
                classes = ['smartslider-slide-toolbox-sliders-active', 'smartslider-slide-toolbox-slide-active'],
                extra = 0;
            
            if(typeof window.wp != 'undefined'){
                extra = 28;
            }
            $edit.on('click', function () {
                $toolbox.addClass(classes[1]).removeClass(classes[0]);
            });
            $list.on('click', function () {
                $toolbox.addClass(classes[0]).removeClass(classes[1]);
            });
            this.switchToEdit = function () {
                $toolbox.addClass(classes[1]).removeClass(classes[0]);
            }


            var maxOffset = parseInt($('.smartslider-slide-console').siblings('h3').offset().top),
                minOffset = parseInt($toolbox.offset().top)
            scrollFn = function () {
                var st = $(this).scrollTop()+extra;
                if (st < minOffset) {
                    $toolbox.css('marginTop', 0);
                } else if (st > maxOffset) {
                    $toolbox.css('marginTop', maxOffset - minOffset);
                } else {
                    $toolbox.css('marginTop', st - minOffset);
                }
                window.nextendsmartslidercolresize();
            };

            $(window).scroll(scrollFn);
            scrollFn();
        }
    });

})(njQuery, window);

function hex2rgba(hex) {
    var r = hexdec(hex.substr(0, 2));
    var g = hexdec(hex.substr(2, 2));
    var b = hexdec(hex.substr(4, 2));
    var a = (intval(hexdec(hex.substr(6, 2)))) / 255;
    a = a.toFixed(3);
    var color = r + "," + g + "," + b + "," + a;
    return 'RGBA(' + color + ')';
}

function hexdec(hex_string) {
    hex_string = (hex_string + '').replace(/[^a-f0-9]/gi, '');
    return parseInt(hex_string, 16);
}

function intval(mixed_var, base) {
    var tmp;
    var type = typeof(mixed_var);
    if (type === 'boolean') {
        return +mixed_var;
    } else if (type === 'string') {
        tmp = parseInt(mixed_var, base || 10);
        return (isNaN(tmp) || !isFinite(tmp)) ? 0 : tmp;
    } else if (type === 'number' && isFinite(mixed_var)) {
        return mixed_var | 0;
    } else {
        return 0;
    }
}(function ($, scope, undefined) {
    scope.ssadminLayersClass = NClass.extend({
        active: false,
        init: function (slide, slideobj, layouturl) {
            var $this = this;
            this.slide = slide;

            this.layercanvas = slide.find('> .smart-slider-canvas-inner');
            if (this.layercanvas.length === 0) this.layercanvas = slide;

            this.parent = slideobj;
            this.slideSize = {
                width: slide.width(),
                height: slide.height()
            };
            this.zindex = [];
            this.activeLayer = $({});
            this.initToolbox();
            this.views = $('.smartslider-slide-view');
            this.toolboxviews = $('.smartslider-slide-toolbox-view');
            this.layerClass = '.smart-slider-layer';
            this.refreshLayers();

            this.layouts = new ssadminLayoutsClass(this, layouturl);

            this.items = new ssadminItemsClass(this);
            this.sortableItems = '> .smart-slider-items, > .smart-slider-item-container';

            this.makeDummyLayerSortable();
            this.layers.each(function () {
                $this.makeLayerResizeable(this);
                $this.makeLayerDraggable(this);
                $this.makeLayerDeletable(this);
                $this.makeLayerZindexable(this);
                $this.makeLayerSortable(this);
                $this.formAddLayer(this);
                $this.items.initLayer(this);
            });
            this.refreshSortableConnectWith();
            this.views.eq(1).on('click', function () {
                $this.switchToLayerTab();
            });
            $('.smartslider-createlayer').on('click', function () {
                $this.createLayer();
                slideconsole.set('Layer created', 2);
            });

            $('#smartslider-slide-toolbox-layer').on('mouseenter',function () {
                $('#smartslider-admin').addClass('smartslider-layer-highlight-active');
            }).on('mouseleave', function () {
                    $('#smartslider-admin').removeClass('smartslider-layer-highlight-active');
                });

            if (this.getParameterByName('action') == 'create') {
                this.layouts.switchToLayoutTab();
            } else {
                this.switchToLayerTab();
            }

            this.enableLayerMode();
            this.items.enableItemMode();

            this.initAdvancedView();

        },
        getParameterByName: function (name) {
            name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
            var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
                results = regex.exec(location.search);
            return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
        },
        switchToLayerTab: function () {
            this.views.removeClass('active');
            this.views.eq(1).addClass('active');
            this.toolboxviews.parent().css((window.nextendDir == 'rtl' ? 'marginRight' : 'marginLeft'), '-100%');
            this.parent.switchToEdit();
            $('#smartslider-admin').removeClass('smartslider-item-mode-active');
            $('#smartslider-admin').addClass('smartslider-layer-mode-active');
            $(window).trigger('resize');
        },
        enableLayerMode: function () {
            if (this.active === true)
                return;
            this.active = true;
            this.layerModeChanged();
        },
        disableLayerMode: function () {
            if (this.active === false)
                return;
            this.active = false;
            this.layerModeChanged();
        },
        layerModeChanged: function () {
            var $this = this;
            this.layers.each(function () {
                if ($this.active) {
                    $(this).draggable("enable");
                } else {
                    $(this).draggable("disable");
                }
            });
            if (this.active) {
                this.slide.addClass('smartslider-layer-mode');
            } else {
                this.slide.removeClass('smartslider-layer-mode');
                if (this.leaveborder) {
                    this.slide.addClass('smartslider-layer-border-mode');
                    this.leaveborder = false;
                }
            }
        },
        createLayer: function () {
            var $layer = $('<div class="smart-slider-layer" style="top: 0%; left: 0%; width: 20%; height: 20%; position: absolute;" data-animation="slide">'),
                layer = $layer[0];
            this.layercanvas.append($layer);
            this.makeLayerResizeable(layer);
            this.makeLayerDraggable(layer);
            this.makeLayerDeletable(layer);
            this.makeLayerZindexable(layer);
            this.makeLayerSortable(layer);
            this.refreshLayers();
            this.formAddLayer(layer);
            this.items.refreshSortableConnect();
            this.refreshSortableConnectWith();
            this.switchToLayerTab();
            this.setActiveLayer($(layer));
        },
        addLayer: function (node) {
            var $layer = $(node).clone(),
                layer = $layer[0];
            $layer.find('[class^=ui-]').remove();
            $layer.find('.active').removeClass('active');
            $layer.find('.ui-resizable').removeClass('ui-resizable');
            $layer.find('.ui-draggable').removeClass('ui-draggable');
            $layer.find('.ui-sortable').removeClass('ui-sortable');
            this.layercanvas.append($layer);
            this.makeLayerResizeable(layer);
            this.makeLayerDraggable(layer);
            this.makeLayerDeletable(layer);
            this.makeLayerZindexable(layer);
            this.makeLayerSortable(layer);
            this.refreshLayers();
            this.formAddLayer(layer);
            this.items.initLayer(layer);
            this.items.refreshSortableConnect();
            this.refreshSortableConnectWith();
            return $layer;
        },
        refreshLayers: function () {
            this.layers = this.slide.find(this.layerClass);
        },
        makeLayerResizeable: function (layer) {
            var $this = this,
                $layer = $(layer);
            $layer.resizable({
                /*disabled: !this.active,*/
                handles: 'n, e, s, w, ne, se, sw, nw',
                containment: this.layercanvas,
                start: function () {
                    $('#smartslider-admin').addClass('smartslider-layer-highlight-active-2');
                },
                stop: function () {
                    $('#smartslider-admin').removeClass('smartslider-layer-highlight-active-2');
                    $this.makeLayerToPercent(this, true, true);
                }
            });

            $layer.find('> .ui-resizable-handle').on('mouseenter',function () {
                slideconsole.set('Resize layer - drag', 1, 0);
            }).on('mouseleave', function () {
                    slideconsole.set('', 1, 0);
                });
        },
        makeLayerDeletable: function (layer) {
            var $this = this;
            var removeLayer = $('<div class="ui-removelayer-handle" style="z-index: 92;"></div>');
            $(layer).append(removeLayer);
            removeLayer.on('click',function () {
                $this.deleteLayer(layer);
                slideconsole.set('Layer deleted', 2);
            }).on('mouseenter',function () {
                    slideconsole.set('Delete layer - click', 1, 0);
                }).on('mouseleave', function () {
                    slideconsole.set('', 1, 0);
                });
        },
        makeLayerZindexable: function (layer) {
            var $this = this,
                $layer = $(layer),
                forward = $('<div class="ui-forward-handle" style="z-index: 91;"></div>'),
                backward = $('<div class="ui-backward-handle" style="z-index: 91;"></div>'),
                $zindex = $('<div class="ui-zindex-handle" style="z-index: 91;"></div>');

            var i = parseInt($layer.css('zIndex'));
            if (!i) {
                i = this.zindex.length > 0 ? this.zindex.length : 1;
            }
            while (this.zindex[i]) {
                i++;
            }
            this.zindex[i] = $layer;
            $layer.css('zIndex', i);

            $layer.data('sszIndex', $zindex);

            $zindex.html(i);
            $layer.append(forward)
                .append($zindex)
                .append(backward);
            forward.on('click',function () {
                var i1 = parseInt($layer.css('zIndex')),
                    i2 = i1 + 1,
                    tmp = undefined;
                if ($this.zindex[i2]) {
                    tmp = $this.zindex[i2];
                    tmp.css('zIndex', i1);
                    tmp.data('sszIndex').html(i1);
                }
                $this.zindex[i2] = $layer;
                $this.zindex[i1] = tmp;
                $layer.css('zIndex', i2);
                $zindex.html(i2);
                //$this.layers.removeClass('smart-slider-main-layer');
                //$($this.zindex[1]).addClass('smart-slider-main-layer');
            }).on('mouseenter',function () {
                    $this.slide.addClass('smart-slider-showzindex');
                }).on('mouseleave', function () {
                    $this.slide.removeClass('smart-slider-showzindex');
                });
            backward.on('click',function () {
                var i1 = parseInt($layer.css('zIndex')),
                    i2 = i1 - 1,
                    tmp = undefined;
                if (i2 < 1)
                    return;
                if ($this.zindex[i2]) {
                    tmp = $this.zindex[i2];
                    tmp.css('zIndex', i1);
                    tmp.data('sszIndex').html(i1);
                }
                $this.zindex[i2] = $layer;
                $this.zindex[i1] = tmp;
                $layer.css('zIndex', i2);
                $zindex.html(i2);
                //$this.layers.removeClass('smart-slider-main-layer');
                //$($this.zindex[1]).addClass('smart-slider-main-layer');
            }).on('mouseenter',function () {
                    $this.slide.addClass('smart-slider-showzindex');
                }).on('mouseleave', function () {
                    $this.slide.removeClass('smart-slider-showzindex');
                });

            $zindex.on('mouseenter',function () {
                $this.slide.addClass('smart-slider-showzindex');
            }).on('mouseleave', function () {
                    $this.slide.removeClass('smart-slider-showzindex');
                });


            forward.on('mouseenter',function () {
                slideconsole.set('Increment z-index - click', 1, 0);
            }).on('mouseleave', function () {
                    slideconsole.set('', 1, 0);
                });

            backward.on('mouseenter',function () {
                slideconsole.set('Decrement z-index - click', 1, 0);
            }).on('mouseleave', function () {
                    slideconsole.set('', 1, 0);
                });

            $zindex.on('mouseenter',function () {
                slideconsole.set('Current z-index', 1, 0);
            }).on('mouseleave', function () {
                    slideconsole.set('', 1, 0);
                });
        },
        makeLayerDraggable: function (layer) {
            var $this = this,
                $layer = $(layer),
                handle = $('<div class="ui-movable-handle" style="z-index: 91;"></div>');
            $layer.draggable({
                disabled: !this.active,
                containment: this.layercanvas,
                create: function () {
                    $(this).append(handle);
                },
                start: function () {
                    $('#smartslider-admin').addClass('smartslider-layer-highlight-active-2');
                },
                stop: function () {
                    $('#smartslider-admin').removeClass('smartslider-layer-highlight-active-2');
                    $this.makeLayerToPercent(this, true);
                },
                handle: '.ui-movable-handle'
            });
            handle.on('mouseenter',function () {
                slideconsole.set('Move layer - drag', 1, 0);
            }).on('mouseleave', function () {
                    slideconsole.set('', 1, 0);
                });
        },
        makeLayerToPercent: function (layer, position, size) {
            var $layer = $(layer);
            if (position) {
                $layer.css('left', (parseFloat($layer.css('left')) / this.slideSize.width * 100).toFixed(3) + '%');
                $layer.css('top', (parseFloat($layer.css('top')) / this.slideSize.height * 100).toFixed(3) + '%');
            }
            if (size) {
                $layer.width(Math.ceil(1000 * $layer.width() / this.slideSize.width * 100) / 1000 + '%');
                $layer.height(Math.ceil(1000 * $layer.height() / this.slideSize.height * 100) / 1000 + '%');
            }
            this.updatePositionField(layer);
        },
        makeLayerSortable: function (layer) {
            var $this = this;
            $(layer).nextendSortable({
                disabled: !this.items.active,
                items: this.sortableItems,
                zIndex: 120000,
                helper: "clone",
                placeholder: "sortable-placeholder",
                forcePlaceholderSize: true,
                tolerance: "pointer",
                appendTo: this.layercanvas,
                handle: '.ui-movableitem-handle',
                update: function (event, ui) {
                    $this.items.updateItem(ui);
                },
                start: function () {
                    $this.slide.addClass('smartslider-layer-border-mode');
                    slideconsole.set('Drop the item into a layer', 2, 0);
                },
                stop: function () {
                    $this.slide.removeClass('smartslider-layer-border-mode');
                    slideconsole.set('Item dropped into the layer', 2);
                }
            });
        },
        makeDummyLayerSortable: function () {
            var $this = this;

            this.dummyLayer = $('#smart-slider-layer-dummy');
            this.dummyLayer.nextendSortable({
                items: this.sortableItems,
                zIndex: 12,
                helper: "clone",
                tolerance: "pointer",
                appendTo: 'body',
                handle: '.ui-movableitem-handle',
                update: function (event, ui) {

                }
            });
            window.dummySortable = this.dummyLayer.data('ui-sortable');
        },
        deleteLayers: function () {
            var $this = this;
            this.layers.each(function (i, layer) {
                $this.deleteLayer(layer);
            });
        },
        deleteLayer: function (layer) {
            var $layer = $(layer);
            //$layer.data('sszIndex');
            this.zindex[parseInt($layer.css('zIndex'))] = null;

            $layer.resizable('destroy');
            $layer.draggable('destroy');
            $layer.nextendSortable('destroy');
            var option = $layer.data('ssoption'),
                select = option.parent()[0],
                optgroup = $layer.data('ssoptgroup'),
                optgroupselect = optgroup.parent()[0];
            select.selectedIndex = optgroupselect.selectedIndex = 0;
            $.fireEvent(optgroupselect, 'change');
            $.fireEvent(select, 'change');
            option.remove();
            optgroup.remove();
            $layer.remove();
            this.refreshLayers();
            this.refreshSortableConnectWith();
            this.items.refreshSortableConnect();
        },
        refreshSortableConnectWith: function () {
            this.layers.nextendSortable('option', 'connectWith', this.layers.add(this.items.items).add(this.dummyLayer));
        },
        destroy: function () {
            /*
             * Use getHTML instead
             * 
             */
            this.layers.resizable('destroy');
            this.layers.draggable('destroy');
            this.layers.nextendSortable('destroy');
            this.slide.find('[class^=ui-]').remove();
            this.slide.find('.active').removeClass('active');
        },
        getHTML: function () {
            var slide = this.layercanvas.clone();
            slide.find('[class^=ui-]').remove();
            slide.find('.active').removeClass('active');
            slide.find('.ui-resizable').removeClass('ui-resizable');
            slide.find('.ui-draggable').removeClass('ui-draggable');
            slide.find('.ui-sortable').removeClass('ui-sortable');
            slide.appendTo($('body'));
            slide.children().removeAttr('aria-disabled');
            var html = slide.html();
            slide.remove();

            return $.trim(html)/*.replace(/\\/g,'\\\\')*/;
        },
        initToolbox: function () {
            var $this = this;
            this.toolbox = $('#smartslider-slide-toolbox-layer');
            this.form = {};
            this.form.tabs = this.toolbox.find('.nextend-tab').slice(1);
            this.form.layers = $('#layerlayer').on('change', function (e) {
                $this.changeActiveLayer(e);
            });
            this.form.layersSelect = $(this.form.layers[0].select).css('float', 'left');
            var deleteLayer = $('<a href="#" class="smartslider-icon smartslider-icon-trash"></a>');
            var selectparent = this.form.layersSelect.parent();
            deleteLayer.css({
                float: 'left',
                marginTop: '2px'
            });
            deleteLayer.appendTo(selectparent);
            deleteLayer.on('click', function (e) {
                e.preventDefault();
                var si = $this.form.layersSelect[0].selectedIndex;
                if (si) {
                    if (confirm('Are you sure that you want to delete the layer?')) {
                        var layer = $($this.form.layersSelect[0].options[si]).data('sslayer');
                        $this.deleteLayer(layer);
                    }
                } else {
                    alert('Layer not selected!');
                }
            });

            var duplicateLayer = $('<a href="#" class="smartslider-icon smartslider-icon-duplicate"></a>');
            duplicateLayer.css({
                float: 'left',
                marginTop: '2px'
            });
            duplicateLayer.appendTo(selectparent);
            duplicateLayer.on('click', function (e) {
                e.preventDefault();
                var si = $this.form.layersSelect[0].selectedIndex;
                if (si) {
                    var $layer = $this.addLayer($($this.form.layersSelect[0].options[si]).data('sslayer'));
                    $this.setActiveLayer($layer);
                } else {
                    alert('Layer not selected!');
                }
            });

            this.form.defaults = {};
            this.form.fields = this.toolbox.find('[name^="layer"]').slice(1);
            this.form.positionfields = this.form.fields.slice(1, 5);

            this.form.positionfields.eq(0).on('change', function () {
                $this.setPositionField($this.activeLayer[0], 'left', this.value);
            });
            this.form.positionfields.eq(1).on('change', function () {
                $this.setPositionField($this.activeLayer[0], 'top', this.value);
            });
            this.form.positionfields.eq(2).on('change', function () {
                $this.setPositionField($this.activeLayer[0], 'width', this.value);
            });
            this.form.positionfields.eq(3).on('change', function () {
                $this.setPositionField($this.activeLayer[0], 'height', this.value);
            });

            this.form.fields = this.form.fields.not(this.form.positionfields);

            this.form.fields.each(function () {
                var $el = $(this);
                $el.data('name', $el.attr('name').match(/layer\[(.*?)\]/)[1]);
            });
            this.form.fields.slice(1).each(function () {
                var $el = $(this),
                    $name = $el.data('name');
                $this.form.defaults[$name] = $el.val();
                $el.on('change', function () {
                    $this.changeActiveLayerData($name, $el.val());
                });
            });
            this.form.fields.eq(0).on('change keyup', function (e) {
                var name = e.currentTarget.value,
                    option = $this.activeLayer.data('ssoption')[0],
                    $options = $($this.form.layersSelect[0].options),
                    namecheckfn = function () {
                        if (this.value == name && this != option) {
                            name += ' - copy';
                            $options.each(namecheckfn);
                            return false;
                        }
                    };
                if (name == '') name = 'empty';
                $options.each(namecheckfn);
                e.currentTarget.value = name;
                $this.changeActiveLayerName(e.currentTarget.value);
            });
            this.form.layers.trigger('change');
        },
        formAddLayer: function (layer) {
            var $layer = $(layer);
            if ($layer.ssdata('name') === undefined) {
                $layer.ssdata('name', 'Layer #' + (this.form.layersSelect[0].options.length));
            }
            var name = $layer.ssdata('name'),
                $options = $(this.form.layersSelect[0].options),
                namecheckfn = function () {
                    if (this.value == name) {
                        name += ' - copy';
                        $layer.ssdata('name', name);
                        $options.each(namecheckfn);
                        return false;
                    }
                };
            $options.each(namecheckfn);

            var $option = $('<option value="' + name + '">' + $layer.ssdata('name') + '</option>');
            this.form.layersSelect.append($option);
            $layer.data('ssoption', $option);
            $option.data('sslayer', $layer);
            var $optgroup = $('<optgroup label="' + $layer.ssdata('name') + '"></optgroup>');
            this.items.form.select.append($optgroup);
            $layer.data('ssoptgroup', $optgroup);
            $optgroup.data('sslayer', $layer);
            this.makeLayerActivable($layer);
        },
        makeLayerActivable: function ($layer) {
            var $this = this;
            $layer.on('mousedown', function (e) {
                $this.setActiveLayer($layer, e);
                slideconsole.set('Layer selected', 1);
            });
        },
        changeActiveLayer: function (e) {
            var select = e.currentTarget.select;
            if (select.selectedIndex === 0) {
                this.form.tabs.css('display', 'none');
                this.activeLayer.removeClass('active');
                this.activeLayer = $({});
                this.form.fields.eq(0).val('Choose a layer');
            } else {
                this.setActiveLayer($(select.options[select.selectedIndex]).data('sslayer'), e);
                this.form.tabs.css('display', 'block');
                $(window).trigger('resize');
            }
        },
        setActiveLayer: function ($layer, e) {
            if (e) {
                if (e.type === 'change' && !this.active) {
                    return;
                } else if (!this.items.clicked) {
                    this.switchToLayerTab();
                }
            }
            if ($layer === this.activeLayer)
                return;
            var $form = this.form,
                $this = this,
                layer = $layer[0];
            this.activeLayer.removeClass('active');
            this.activeLayer = $layer;
            this.activeLayer.addClass('active');
            var option = $layer.data('ssoption');

            if (option.val() !== $form.layers.val()) {
                $form.layers.val(option.val());
                $.fireEvent($form.layers[0], 'change');
            }

            this.updatePositionField(layer);

            this.form.fields.each(function () {
                var $el = $(this),
                    name = $el.data('name');
                $this.changeFormValueFromData($el, name, $layer);
            });

        },
        updatePositionField: function (layer) {
            this.form.positionfields.eq(0).val(layer.style.left);
            this.form.positionfields.eq(1).val(layer.style.top);
            this.form.positionfields.eq(2).val(layer.style.width);
            this.form.positionfields.eq(3).val(layer.style.height);
        },
        setPositionField: function (layer, prop, v) {
            if (v.match(/^[0-9]*\.?[0-9]*%$/) !== null) {
                layer.style[prop] = v;
            } else if (v.match(/^[0-9]*px$/) !== null) {
                layer.style[prop] = v;
                this.makeLayerToPercent(layer, (prop === 'top' || prop === 'left'), (prop === 'width' || prop === 'height'));
            } else if (parseInt(v) === 0) {
                layer.style[prop] = '0%';
            }
            return layer.style[prop];
        },
        changeFormValueFromData: function ($el, name, $layer) {
            var layerValue = $layer.ssdata(name);
            if (layerValue === undefined) {
                $layer.ssdata(name, this.form.defaults[name]);
                layerValue = this.form.defaults[name];
            }
            if ($el.val() !== layerValue) {
                $el.val(layerValue);
                $.fireEvent($el[0], 'change');
            }
        },
        changeActiveLayerName: function (name) {
            if (this.activeLayer.length === 0)
                return;
            this.activeLayer.ssdata('name', name).data('ssoption').val(name).text(name);
            this.activeLayer.data('ssoptgroup').attr('label', name);
            this.form.layers.val(name);
        },
        changeActiveLayerData: function (name, value) {
            this.activeLayer.ssdata(name, value);
        },

        initAdvancedView: function () {
            var $this = this,
                $admin = $('#smartslider-admin'),
                options = $('.smartslider-advanced-layers .smartslider-toolbar-options'),
                classes = ['smartslider-advanced-layers-simple-active', 'smartslider-advanced-layers-advanced-active'],
                tableContainer = $('.smartslider-slide-advanced-layers').css('display', 'none');
            table = $('<table><thead><th>Layer name</th><th>Left<br>Top</th><th>Width<br>Height</th><th></th><th>Animation</th><th>Duration</th><th>Easing</th><th>Delay</th><th>Parallax</th><th>Play out</th></thead><tbody></tbody></table>')
            tbody = table.find('tbody');

            tableContainer.append(table);

            options.eq(0).on('click', function () {
                $admin.addClass(classes[0]).removeClass(classes[1]);
                tableContainer.css('display', 'none');
                $('.ui-layer-overlay').remove();
                tbody.children().remove();
                $(window).trigger('resize');
            });
            options.eq(1).on('click', function () {
                var activeTRs = $([]);
                $admin.addClass(classes[1]).removeClass(classes[0]);
                var select = $this.form.layersSelect;
                select[0].selectedIndex = 0;
                NfireEvent(select[0], 'change');

                var animationSelect = $($this.form.fields.get(1).select).clone().removeAttr('id'),
                    easingSelect = $($this.form.fields.get(3).select).clone().removeAttr('id'),
                    msInput = $this.form.fields.eq(2).parent().clone(),
                    onoff = $this.form.fields.eq(6).parent().clone();

                msInput.find('input').removeAttr('id');
                onoff.find('input').removeAttr('id');

                var layers = $this.layers;
                layers.each(function (i) {

                    var layer = this,
                        $el = $(this),
                        $tr = $('<tr class="n-in ' + (i % 2 ? 'even' : 'odd') + '"></tr>'),
                        $tr2 = $('<tr class="n-out ' + (i % 2 ? 'even' : 'odd') + '"></tr>');

                    $el.append($('<div class="ui-layer-overlay"></div>').on('click', function(){
                        activeTRs.removeClass('active');
                        activeTRs = $.merge($tr, $tr2).addClass('active');
                    }));

                    $tr.append($('<td rowspan="2" class="rs2">' +
                        '<div class="nextend-text">' +
                        '<input type="text" autocomplete="off" value="' + $el.data('name') + '" name="row-' + i + '-name">' +
                        '</div>' +
                        '</td>'));
                    $tr.append($('<td>' +
                        '<div class="nextend-text" style="width:50px;">' +
                        '<input type="text" autocomplete="off" value="' + layer.style.left + '" name="row-' + i + '-left">' +
                        '</div>' +
                        '</td>'));
                    $tr2.append($('<td>' +
                        '<div class="nextend-text" style="width:50px;">' +
                        '<input type="text" autocomplete="off" value="' + layer.style.top + '" name="row-' + i + '-top">' +
                        '</div>' +
                        '</td>'));
                    $tr.append($('<td>' +
                        '<div class="nextend-text" style="width:50px;">' +
                        '<input type="text" autocomplete="off" value="' + layer.style.width + '" name="row-' + i + '-width">' +
                        '</div>' +
                        '</td>'));
                    $tr2.append($('<td>' +
                        '<div class="nextend-text" style="width:50px;">' +
                        '<input type="text" autocomplete="off" value="' + layer.style.height + '" name="row-' + i + '-height">' +
                        '</div>' +
                        '</td>'));
                    $tr.append($('<td class="t-label">In</td>'));
                    $tr2.append($('<td class="t-label">Out</td>'));

                    $tr.append($('<td></td>').append(animationSelect.clone().attr('name', 'row-' + i + '-animationin').val($el.data('animationin'))));
                    $tr2.append($('<td></td>').append(animationSelect.clone().attr('name', 'row-' + i + '-animationout').val($el.data('animationout'))));

                    var ms = msInput.clone();
                    ms.find('input').attr('name', 'row-' + i + '-durationin').val($el.data('durationin'));
                    $tr.append($('<td></td>').append(ms));
                    var ms = msInput.clone();
                    ms.find('input').attr('name', 'row-' + i + '-durationout').val($el.data('durationout'));
                    $tr2.append($('<td></td>').append(ms));


                    $tr.append($('<td></td>').append(easingSelect.clone().attr('name', 'row-' + i + '-easingin').val($el.data('easingin'))));
                    $tr2.append($('<td></td>').append(easingSelect.clone().attr('name', 'row-' + i + '-easingout').val($el.data('easingout'))));


                    var ms = msInput.clone();
                    ms.find('input').attr('name', 'row-' + i + '-delayin').val($el.data('delayin'));
                    $tr.append($('<td></td>').append(ms));
                    var ms = msInput.clone();
                    ms.find('input').attr('name', 'row-' + i + '-delayout').val($el.data('delayout'));
                    $tr2.append($('<td></td>').append(ms));

                    $tr.append($('<td>' +
                        '<div class="nextend-text" style="width:50px;">' +
                        '<input  type="text" autocomplete="off" value="' + $el.data('parallaxin') + '" name="row-' + i + '-parallaxin">' +
                        '</div>' +
                        '</td>'));
                    $tr2.append($('<td>' +
                        '<div class="nextend-text" style="width:50px;">' +
                        '<input type="text" autocomplete="off" value="' + $el.data('parallaxout') + '" name="row-' + i + '-parallaxout">' +
                        '</div>' +
                        '</td>'));

                    var playoutid = 'row-' + i + '-playoutafter';
                    var playout = onoff.clone();
                    playout.find('input').attr('id', playoutid).attr('name', 'row-' + i + '-playoutafter').val($el.data('playoutafter'));
                    $tr.append($('<td></td>').append(playout));
                    $tr2.append($('<td></td>'));

                    tbody.append($tr);
                    tbody.append($tr2);

                    new NextendElementOnoff({
                        hidden: playoutid
                    });

                });

                tbody.find('input, select').on('change', function () {
                    var $el = $(this),
                        field = $el.attr('name').match(/row-([0-9]+)-(.*)/);
                    if (field.length == 3) {
                        field[1] = parseInt(field[1]);

                        var $layer = $this.layers.eq(field[1]);

                        switch (field[2]) {
                            case 'left':
                            case 'top':
                            case 'width':
                            case 'height':
                                $el.val($this.setPositionField($layer[0], field[2], $el.val()));
                                break;
                            case 'name':
                                var name = $el.val(),
                                    option = $layer.data('ssoption')[0],
                                    $options = $($this.form.layersSelect[0].options),
                                    namecheckfn = function () {
                                        if (this.value == name && this != option) {
                                            name += ' - copy';
                                            $options.each(namecheckfn);
                                            return false;
                                        }
                                    };
                                if (name == '') name = 'empty';
                                $options.each(namecheckfn);
                                $this.setActiveLayer($layer);
                                $this.changeActiveLayerName(name);
                                select[0].selectedIndex = 0;
                                NfireEvent(select[0], 'change');
                                $el.val(name);
                                break;
                            default:
                                $layer.ssdata(field[2], $el.val());
                                break;
                        }
                    }
                });
                tableContainer.css('display', 'block');
                $(window).trigger('resize');
            });

        }
    });
})(njQuery, window);(function ($, scope, undefined) {

    scope.ssadminItemsClass = NClass.extend({
        active: false,
        init: function (layers) {
            var $this = this;
            this.layers = layers;
            this.slide = layers.slide;

            this.activeItem = $({});
            this.activeItemType = '';

            this.dummyitem = $('<div />').ssdata('itemvalues', JSON.stringify({}));
            this.form = {};

            this.form.select = $('#itemitems_select').on('change', function () {
                $this.changeActiveItem();
            }).css('float', 'left');
            ndojo.disconnect(this.form.select[0].dojohandle);

            var deleteItem = $('<a href="#" class="smartslider-icon smartslider-icon-trash"></a>');
            var selectparent = this.form.select.parent();
            deleteItem.css({
                float: 'left',
                marginTop: '2px'
            });
            deleteItem.appendTo(selectparent);
            deleteItem.on('click', function (e) {
                e.preventDefault();
                var si = $this.form.select[0].selectedIndex;
                if (si) {
                    if (confirm('Are you sure that you want to delete the item?')) {
                        var item = $($this.form.select[0].options[si]).data('ssitem');
                        $this.deleteItem(item[0]);
                    }
                }else{
                    alert('Item not selected!');
                }
            });

            var duplicateItem = $('<a href="#" class="smartslider-icon smartslider-icon-duplicate"></a>');
            duplicateItem.css({
                float: 'left',
                marginTop: '2px'
            });
            duplicateItem.appendTo(selectparent);
            duplicateItem.on('click', function (e) {
                e.preventDefault();
                var si = $this.form.select[0].selectedIndex;
                if (si) {
                    var $curr = $($this.form.select[0].options[si]).data('ssitem'),
                        $item = $curr.clone();
                    $item.find('[class^=ui-]').remove();
                    $item.removeClass('active');
                    $item.appendTo($curr.parent());
                    $this.makeItemRemovable($item[0]);
                    $this.makeItemMovable($item[0]);
                    $this.makeItemActivable($item[0]);
                    $this.setActiveItem($item[0]);
                }else{
                    alert('Item not selected!');
                }
            });

            this.items = $('#draggableitems .smart-slider-item-container');
            this.items.qtip({
                content: {
                    text: "Drag the item and drop into a layer!"
                },
                show: {
                    event: 'mousedown'
                },
                position: {
                    my: "bottom left",
                    at: "top center"
                }
            });


            this.items.draggable({
                cursor: 'pointer',
                helper: 'clone',
                zIndex: 12,
                opacity: 0.5,
                connectToSortable: this.layers.layers.add(this.layers.dummyLayer),
                appendTo: $('#smartslider-form'),
                start: function () {
                    window.ssdrag = true;
                    $this.slide.addClass('smartslider-layer-border-mode');
                    slideconsole.set('Drop the item into a layer', 2, 0);
                },
                stop: function () {
                    window.ssdrag = false;
                    $this.layers.leaveborder = false;
                    $this.slide.removeClass('smartslider-layer-border-mode');
                    slideconsole.set('Item dropped into the layer', 2);
                }
            }).on('mousedown', function () {
                    $this.layers.leaveborder = true;
                });

            this.views = this.layers.views;
            this.toolboxviews = this.layers.toolboxviews;

            this.views.eq(2).on('click', function () {
                $this.switchToItemTab();
            });
        },
        refreshSortableConnect: function () {
            this.items.draggable("option", "connectToSortable", this.layers.layers.add(this.layers.dummyLayer));
        },
        switchToItemTab: function () {
            this.views.removeClass('active');
            this.views.eq(2).addClass('active');
            this.toolboxviews.parent().css((window.nextendDir == 'rtl' ? 'marginRight' : 'marginLeft'), (window.nextendDir == 'rtl' ? '0' : '-200%'));
            this.layers.parent.switchToEdit();
            $('#smartslider-admin').removeClass('smartslider-layer-mode-active');
            $('#smartslider-admin').addClass('smartslider-item-mode-active');
            $(window).trigger('resize');
        },
        enableItemMode: function () {
            if (this.active === true)
                return;
            this.active = true;
            this.itemModeChanged();
        },
        disableItemMode: function () {
            if (this.active === false)
                return;
            this.active = false;
            this.itemModeChanged();
        },
        itemModeChanged: function () {
            var $this = this;
            if ($this.active) {
                this.layers.layers.nextendSortable('enable');
                $this.slide.addClass('smartslider-item-mode');
            } else {
                this.layers.layers.nextendSortable('disable');
                $this.slide.removeClass('smartslider-item-mode');
            }
        },
        initLayer: function (layer) {
            var $layer = $(layer),
                $this = this;
            $layer.find('.smart-slider-items').each(function () {
                $this.makeItemRemovable(this);
                $this.makeItemMovable(this);
                $this.makeItemActivable(this);
            });
        },
        updateItem: function (ui) {
            if (ui.item.parent()[0] === this.layers.dummyLayer[0]) {
                ui.item.remove();
                return;
            }
            var addeditem = ui.item.find('.smart-slider-items').css('display', '');
            if (addeditem.length > 0) { // item add from outside
                ui.item.replaceWith(addeditem);
                this.makeItemRemovable(addeditem);
                this.makeItemMovable(addeditem);
                this.makeItemActivable(addeditem);
                this.setActiveItem(addeditem);
            } else {
                var item = ui.item,
                    next = item.next('.smart-slider-items');
                if (next.length === 1) {
                    next.data('ssoption').before(ui.item.data('ssoption'));
                } else {
                    ui.item.closest('.smart-slider-layer').data('ssoptgroup').append(ui.item.data('ssoption'));
                }
            }
        },
        deleteItem: function (item) {
            $(item).data('ssoption').remove();
            this.changeActiveItem();

            $(item).remove();
            slideconsole.set('Item deleted', 2);
        },
        makeItemRemovable: function (item) {
            var $this = this,
                removeItem = $('<div class="ui-helper ui-removeitem-handle" style="z-index: 92;"></div>');
            $(item).append(removeItem);
            removeItem.on('click',function () {
                $this.deleteItem(item);
            }).on('mouseenter',function () {
                    slideconsole.set('Delete item - click', 1, 0);
                }).on('mouseleave', function () {
                    slideconsole.set('', 1, 0);
                });
        },
        makeItemMovable: function (item) {
            var $this = this,
                moveItem = $('<div class="ui-helper ui-movableitem-handle" style="z-index: 92;"></div>');
            $(item).append(moveItem);
            moveItem.on('mouseenter',function () {
                slideconsole.set('Move item - drag and drop into layers', 1, 0);
            }).on('mouseleave', function () {
                    slideconsole.set('', 1, 0);
                });
        },
        makeItemActivable: function (item) {
            var $this = this,
                $item = $(item),
                overlayItem = $('<div class="ui-helper ui-item-overlay" style="z-index: 89;"></div>');
            $item.append(overlayItem);
            overlayItem.on('mouseenter',function () {
                slideconsole.set('Select item - click', 1, 0);
            }).on('mouseleave', function () {
                    slideconsole.set('', 1, 0);
                });

            $item.ssdata('item');

            var $option = $('<option>' + $item.ssdata('item') + '</option>');
            $item.data('ssoption', $option);
            $option.data('ssitem', $item);
            var next = $item.next('.smart-slider-items');
            if (next.length === 1 && next.data('ssoption')) {
                next.data('ssoption').before($option);
            } else {
                $item.parent().data('ssoptgroup').append($option);
            }

            $item.on('click',function () {
                $this.setActiveItem(item);
                slideconsole.set('Item selected', 2);
            }).on('mousedown', function (e) {
                    $this.clicked = true;
                    setTimeout(function () {
                        $this.clicked = false;
                    }, 200);
                });
        },
        changeActiveItem: function () {
            var select = this.form.select[0],
                i = select.selectedIndex,
                item = $(select.options[i]).data('ssitem');
            if (item !== undefined) {
                item.trigger('mousedown').trigger('mouseup').trigger('click');
            } else {
                this.setActiveItem(this.dummyitem[0]);
            }
        },
        setActiveItem: function (item) {
            var $this = this,
                $item = $(item),
                type = $item.data('item'),
                values = JSON.parse($item.ssdata('itemvalues'));

            if (this.form[type] === undefined) {
                this.form[type] = {};
                this.form[type].form = $('#smartslider-slide-toolbox-item-type-' + type);
                this.form[type].template = this.form[type].form.data('itemtemplate');

                this.form[type].fields = this.form[type].form.find('[name^="item_' + type + '"]');
                this.form[type].fields.on('change keydown', function () {
                    var timeout = $item.data('timeout');
                    if (timeout) clearTimeout(timeout);
                    $item.data('timeout', setTimeout(function () {
                        $this.updateCurrentItem();
                    }, 100));
                });
            }
            this.activeItem.removeClass('active');
            if (this.activeItemType !== '')
                this.form[this.activeItemType].form.css('display', 'none');


            this.activeItem = $item;
            this.activeItemType = type;
            for (key in values) {
                var el = $('#item_' + type + key);
                if (el.length > 0) {
                    el.val(values[key]/*.replace(/\\n/g, "\n")*/);
                    $.fireEvent(el[0], 'change');
                }
            }

            this.form[this.activeItemType].form.css('display', 'block');

            this.form.select[0].selectedIndex = this.form.select.find('option').index(this.activeItem.data('ssoption'));

            this.activeItem.addClass('active');
            if (item != this.dummyitem[0])
                this.switchToItemTab();
        },
        updateCurrentItem: function () {
            var data = {},
                re = new RegExp('item_' + this.activeItemType + "\\[(.*?)\\]", ""),
                form = this.form[this.activeItemType],
                html = form.template,
                parser = null;
            if (scope['ssItemParser' + this.activeItemType] !== undefined) {
                parser = new scope['ssItemParser' + this.activeItemType];
            } else {
                parser = new scope['ssItemParser'];
            }
            form.fields.each(function () {
                var $el = $(this),
                    name = $el.attr('name').match(re)[1];
                data[name] = $el.val();
                var _data = parser.parse(name, data[name]);
                for (var k in _data) {
                    var reg = new RegExp('\\{' + k + '\\}', 'g');
                    html = html.replace(reg, _data[k]);
                    data[k] = _data[k];
                }
            });
            
            var helpers = this.activeItem.find('.ui-helper');
            $('<div />').append(helpers);

            this.activeItem.html(parser.render($(html
                .replace(/\{\{id\}\}/g, "nextend-smart-slider-0")
                .replace(/\{\{uuid\}\}/g, $.fn.uid())
                .replace(/\\"/g, "&quot;")
                .replace(/\\'/g, "&#039;")), data));
            this.activeItem.append(helpers);
            this.activeItem.ssdata('itemvalues', JSON.stringify(data));
        }
    });
})(njQuery, window);(function ($, scope, undefined) {

    scope.ssadminLayoutsClass = NClass.extend({
        active: false,
        init: function (layers, layouturl) {
            var $this = this;
            this.layers = layers;
            this.slide = layers.slide;

            this.layouturl = layouturl;

            this.views = this.layers.views;
            this.toolboxviews = this.layers.toolboxviews;

            this.views.eq(0).on('click', function () {
                $this.switchToLayoutTab();
            });

            this.defaultAndCustom();

            var $dl = $('.smartslider-slide-layout-custom > dl');

            $('.smartslider-savelayout').on('click', function (e) {
                e.preventDefault();
                if ($this.slide[0].ssanimation === 0) {
                    var html = $this.layers.getHTML(),
                        base64HTML = Base64.encode(html),
                        title = $('#slidetitle').val();
                    if (title == '') {
                        alert('Title is empty! Save failed...');
                        return;
                    }

                    $.ajax({
                        type: "POST",
                        url: layouturl,
                        data: {
                            save: 1,
                            ajax: 1,
                            layout: {
                                title: title,
                                slide: base64HTML
                            }
                        },
                        success: function () {
                            var dts = $dl.find('> dt');
                            var dt = $('<dt class="'+((dts.length + 1) % 2 ? 'odd' : 'even')+
                            ' smartslider-button-blue-active smartslider-icon-container">' +
                                '<a class="smartslider-button-link smartslider-load-layout" href="#">' + title + '</a>' +
                                '<div class="smartslider-layout-container"></div>' +
                            '</dt>');
                            dt.find('.smartslider-layout-container').html(html);
                            dt.appendTo($dl);
                            dt.find('.smartslider-load-layout').on('click', function (e) {
                                e.preventDefault();
                                var layout = $(this).siblings('.smartslider-layout-container');
                
                                $this.layers.deleteLayers();
                                layout.children().each(function (i, layer) {
                                    $this.layers.addLayer(layer);
                                });
                            });
                            $('.smartslider-layout-custom').trigger('click');
                        },
                        fail: function () {
                            alert('Unexpected error. Saving failed...');
                        }
                    });

                    return true;
                }
            });

            this.initCustom();
        },
        switchToLayoutTab: function () {
            this.views.removeClass('active');
            this.views.eq(0).addClass('active');
            this.toolboxviews.parent().css((window.nextendDir == 'rtl' ? 'marginRight' : 'marginLeft'), (window.nextendDir == 'rtl' ? '-200%' : '0%'));
            $('#smartslider-admin').removeClass('smartslider-item-mode-active');
            $('#smartslider-admin').addClass('smartslider-layer-mode-active');
            $(window).trigger('resize');
        },
        defaultAndCustom: function () {
            var $toolbox = $('#smartslider-slide-toolbox'),
                $list = $('.smartslider-layout-default'),
                $edit = $('.smartslider-layout-custom'),
                classes = ['smartslider-slide-layout-default-active', 'smartslider-slide-layout-custom-active'];
            $edit.on('click', function () {
                $toolbox.addClass(classes[1]).removeClass(classes[0]);
            });
            $list.on('click', function () {
                $toolbox.addClass(classes[0]).removeClass(classes[1]);
            });
            this.switchToEdit = function () {
                $toolbox.addClass(classes[1]).removeClass(classes[0]);
            }
        },
        initCustom: function () {
            var $this = this;
            this.customs = $('.smartslider-slide-layout-pane-inner .smartslider-load-layout');
            this.customs.on('click', function (e) {
                e.preventDefault();
                var layout = $(this).siblings('.smartslider-layout-container');

                $this.layers.deleteLayers();
                layout.children().each(function (i, layer) {
                    $this.layers.addLayer(layer);
                });
            });
        }
    });
})(njQuery, window);/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/

/*
	This is an optimized version of Dojo, built for deployment and not for
	development. To get sources and documentation, please visit:

		http://dojotoolkit.org
*/
;(function(){
  var djConfig = {
      scopeMap: [
          ["dojo", "ndojo"],
          ["dijit", "ndijit"],
          ["dojox", "ndojox"]
      ]
  };
  (function(){var _1=null;if((_1||(typeof djConfig!="undefined"&&djConfig.scopeMap))&&(typeof window!="undefined")){var _2="",_3="",_4="",_5={},_6={};_1=_1||djConfig.scopeMap;for(var i=0;i<_1.length;i++){var _7=_1[i];_2+="var "+_7[0]+" = {}; "+_7[1]+" = "+_7[0]+";"+_7[1]+"._scopeName = '"+_7[1]+"';";_3+=(i==0?"":",")+_7[0];_4+=(i==0?"":",")+_7[1];_5[_7[0]]=_7[1];_6[_7[1]]=_7[0];}eval(_2+"dojo._scopeArgs = ["+_4+"];");dojo._scopePrefixArgs=_3;dojo._scopePrefix="(function("+_3+"){";dojo._scopeSuffix="})("+_4+")";dojo._scopeMap=_5;dojo._scopeMapRev=_6;}(function(){if(typeof this["loadFirebugConsole"]=="function"){this["loadFirebugConsole"]();}else{this.console=this.console||{};var cn=["assert","count","debug","dir","dirxml","error","group","groupEnd","info","profile","profileEnd","time","timeEnd","trace","warn","log"];var i=0,tn;while((tn=cn[i++])){if(!console[tn]){(function(){var _8=tn+"";console[_8]=("log" in console)?function(){var a=Array.apply({},arguments);a.unshift(_8+":");console["log"](a.join(" "));}:function(){};console[_8]._fake=true;})();}}}if(typeof dojo=="undefined"){dojo={_scopeName:"dojo",_scopePrefix:"",_scopePrefixArgs:"",_scopeSuffix:"",_scopeMap:{},_scopeMapRev:{}};}var d=dojo;if(typeof dijit=="undefined"){dijit={_scopeName:"dijit"};}if(typeof dojox=="undefined"){dojox={_scopeName:"dojox"};}if(!d._scopeArgs){d._scopeArgs=[dojo,dijit,dojox];}d.global=this;d.config={isDebug:false,debugAtAllCosts:false};var _9=typeof djConfig!="undefined"?djConfig:typeof dojoConfig!="undefined"?dojoConfig:null;if(_9){for(var c in _9){d.config[c]=_9[c];}}dojo.locale=d.config.locale;var _a="$Rev: 24595 $".match(/\d+/);dojo.version={major:1,minor:6,patch:1,flag:"",revision:_a?+_a[0]:NaN,toString:function(){with(d.version){return major+"."+minor+"."+patch+flag+" ("+revision+")";}}};if(typeof OpenAjax!="undefined"){OpenAjax.hub.registerLibrary(dojo._scopeName,"http://dojotoolkit.org",d.version.toString());}var _b,_c,_d={};for(var i in {toString:1}){_b=[];break;}dojo._extraNames=_b=_b||["hasOwnProperty","valueOf","isPrototypeOf","propertyIsEnumerable","toLocaleString","toString","constructor"];_c=_b.length;dojo._mixin=function(_e,_f){var _10,s,i;for(_10 in _f){s=_f[_10];if(!(_10 in _e)||(_e[_10]!==s&&(!(_10 in _d)||_d[_10]!==s))){_e[_10]=s;}}if(_c&&_f){for(i=0;i<_c;++i){_10=_b[i];s=_f[_10];if(!(_10 in _e)||(_e[_10]!==s&&(!(_10 in _d)||_d[_10]!==s))){_e[_10]=s;}}}return _e;};dojo.mixin=function(obj,_11){if(!obj){obj={};}for(var i=1,l=arguments.length;i<l;i++){d._mixin(obj,arguments[i]);}return obj;};dojo._getProp=function(_12,_13,_14){var obj=_14||d.global;for(var i=0,p;obj&&(p=_12[i]);i++){if(i==0&&d._scopeMap[p]){p=d._scopeMap[p];}obj=(p in obj?obj[p]:(_13?obj[p]={}:undefined));}return obj;};dojo.setObject=function(_15,_16,_17){var _18=_15.split("."),p=_18.pop(),obj=d._getProp(_18,true,_17);return obj&&p?(obj[p]=_16):undefined;};dojo.getObject=function(_19,_1a,_1b){return d._getProp(_19.split("."),_1a,_1b);};dojo.exists=function(_1c,obj){return d.getObject(_1c,false,obj)!==undefined;};dojo["eval"]=function(_1d){return d.global.eval?d.global.eval(_1d):eval(_1d);};d.deprecated=d.experimental=function(){};})();(function(){var d=dojo,_1e;d.mixin(d,{_loadedModules:{},_inFlightCount:0,_hasResource:{},_modulePrefixes:{dojo:{name:"dojo",value:"."},doh:{name:"doh",value:"../util/doh"},tests:{name:"tests",value:"tests"}},_moduleHasPrefix:function(_1f){var mp=d._modulePrefixes;return !!(mp[_1f]&&mp[_1f].value);},_getModulePrefix:function(_20){var mp=d._modulePrefixes;if(d._moduleHasPrefix(_20)){return mp[_20].value;}return _20;},_loadedUrls:[],_postLoad:false,_loaders:[],_unloaders:[],_loadNotifying:false});dojo._loadPath=function(_21,_22,cb){var uri=((_21.charAt(0)=="/"||_21.match(/^\w+:/))?"":d.baseUrl)+_21;try{_1e=_22;return !_22?d._loadUri(uri,cb):d._loadUriAndCheck(uri,_22,cb);}catch(e){console.error(e);return false;}finally{_1e=null;}};dojo._loadUri=function(uri,cb){if(d._loadedUrls[uri]){return true;}d._inFlightCount++;var _23=d._getText(uri,true);if(_23){d._loadedUrls[uri]=true;d._loadedUrls.push(uri);if(cb){_23=/^define\(/.test(_23)?_23:"("+_23+")";}else{_23=d._scopePrefix+_23+d._scopeSuffix;}if(!d.isIE){_23+="\r\n//@ sourceURL="+uri;}var _24=d["eval"](_23);if(cb){cb(_24);}}if(--d._inFlightCount==0&&d._postLoad&&d._loaders.length){setTimeout(function(){if(d._inFlightCount==0){d._callLoaded();}},0);}return !!_23;};dojo._loadUriAndCheck=function(uri,_25,cb){var ok=false;try{ok=d._loadUri(uri,cb);}catch(e){console.error("failed loading "+uri+" with error: "+e);}return !!(ok&&d._loadedModules[_25]);};dojo.loaded=function(){d._loadNotifying=true;d._postLoad=true;var mll=d._loaders;d._loaders=[];for(var x=0;x<mll.length;x++){mll[x]();}d._loadNotifying=false;if(d._postLoad&&d._inFlightCount==0&&mll.length){d._callLoaded();}};dojo.unloaded=function(){var mll=d._unloaders;while(mll.length){(mll.pop())();}};d._onto=function(arr,obj,fn){if(!fn){arr.push(obj);}else{if(fn){var _26=(typeof fn=="string")?obj[fn]:fn;arr.push(function(){_26.call(obj);});}}};dojo.ready=dojo.addOnLoad=function(obj,_27){d._onto(d._loaders,obj,_27);if(d._postLoad&&d._inFlightCount==0&&!d._loadNotifying){d._callLoaded();}};var dca=d.config.addOnLoad;if(dca){d.addOnLoad[(dca instanceof Array?"apply":"call")](d,dca);}dojo._modulesLoaded=function(){if(d._postLoad){return;}if(d._inFlightCount>0){console.warn("files still in flight!");return;}d._callLoaded();};dojo._callLoaded=function(){if(typeof setTimeout=="object"||(d.config.useXDomain&&d.isOpera)){setTimeout(d.isAIR?function(){d.loaded();}:d._scopeName+".loaded();",0);}else{d.loaded();}};dojo._getModuleSymbols=function(_28){var _29=_28.split(".");for(var i=_29.length;i>0;i--){var _2a=_29.slice(0,i).join(".");if(i==1&&!d._moduleHasPrefix(_2a)){_29[0]="../"+_29[0];}else{var _2b=d._getModulePrefix(_2a);if(_2b!=_2a){_29.splice(0,i,_2b);break;}}}return _29;};dojo._global_omit_module_check=false;dojo.loadInit=function(_2c){_2c();};dojo._loadModule=dojo.require=function(_2d,_2e){_2e=d._global_omit_module_check||_2e;var _2f=d._loadedModules[_2d];if(_2f){return _2f;}var _30=d._getModuleSymbols(_2d).join("/")+".js";var _31=!_2e?_2d:null;var ok=d._loadPath(_30,_31);if(!ok&&!_2e){throw new Error("Could not load '"+_2d+"'; last tried '"+_30+"'");}if(!_2e&&!d._isXDomain){_2f=d._loadedModules[_2d];if(!_2f){throw new Error("symbol '"+_2d+"' is not defined after loading '"+_30+"'");}}return _2f;};dojo.provide=function(_32){_32=_32+"";return (d._loadedModules[_32]=d.getObject(_32,true));};dojo.platformRequire=function(_33){var _34=_33.common||[];var _35=_34.concat(_33[d._name]||_33["default"]||[]);for(var x=0;x<_35.length;x++){var _36=_35[x];if(_36.constructor==Array){d._loadModule.apply(d,_36);}else{d._loadModule(_36);}}};dojo.requireIf=function(_37,_38){if(_37===true){var _39=[];for(var i=1;i<arguments.length;i++){_39.push(arguments[i]);}d.require.apply(d,_39);}};dojo.requireAfterIf=d.requireIf;dojo.registerModulePath=function(_3a,_3b){d._modulePrefixes[_3a]={name:_3a,value:_3b};};dojo.requireLocalization=function(_3c,_3d,_3e,_3f){d.require("dojo.i18n");d.i18n._requireLocalization.apply(d.hostenv,arguments);};var ore=new RegExp("^(([^:/?#]+):)?(//([^/?#]*))?([^?#]*)(\\?([^#]*))?(#(.*))?$"),ire=new RegExp("^((([^\\[:]+):)?([^@]+)@)?(\\[([^\\]]+)\\]|([^\\[:]*))(:([0-9]+))?$");dojo._Url=function(){var n=null,_40=arguments,uri=[_40[0]];for(var i=1;i<_40.length;i++){if(!_40[i]){continue;}var _41=new d._Url(_40[i]+""),_42=new d._Url(uri[0]+"");if(_41.path==""&&!_41.scheme&&!_41.authority&&!_41.query){if(_41.fragment!=n){_42.fragment=_41.fragment;}_41=_42;}else{if(!_41.scheme){_41.scheme=_42.scheme;if(!_41.authority){_41.authority=_42.authority;if(_41.path.charAt(0)!="/"){var _43=_42.path.substring(0,_42.path.lastIndexOf("/")+1)+_41.path;var _44=_43.split("/");for(var j=0;j<_44.length;j++){if(_44[j]=="."){if(j==_44.length-1){_44[j]="";}else{_44.splice(j,1);j--;}}else{if(j>0&&!(j==1&&_44[0]=="")&&_44[j]==".."&&_44[j-1]!=".."){if(j==(_44.length-1)){_44.splice(j,1);_44[j-1]="";}else{_44.splice(j-1,2);j-=2;}}}}_41.path=_44.join("/");}}}}uri=[];if(_41.scheme){uri.push(_41.scheme,":");}if(_41.authority){uri.push("//",_41.authority);}uri.push(_41.path);if(_41.query){uri.push("?",_41.query);}if(_41.fragment){uri.push("#",_41.fragment);}}this.uri=uri.join("");var r=this.uri.match(ore);this.scheme=r[2]||(r[1]?"":n);this.authority=r[4]||(r[3]?"":n);this.path=r[5];this.query=r[7]||(r[6]?"":n);this.fragment=r[9]||(r[8]?"":n);if(this.authority!=n){r=this.authority.match(ire);this.user=r[3]||n;this.password=r[4]||n;this.host=r[6]||r[7];this.port=r[9]||n;}};dojo._Url.prototype.toString=function(){return this.uri;};dojo.moduleUrl=function(_45,url){var loc=d._getModuleSymbols(_45).join("/");if(!loc){return null;}if(loc.lastIndexOf("/")!=loc.length-1){loc+="/";}var _46=loc.indexOf(":");if(loc.charAt(0)!="/"&&(_46==-1||_46>loc.indexOf("/"))){loc=d.baseUrl+loc;}return new d._Url(loc,url);};})();if(typeof window!="undefined"){dojo.isBrowser=true;dojo._name="browser";(function(){var d=dojo;if(document&&document.getElementsByTagName){var _47=document.getElementsByTagName("script");var _48=/dojo(\.xd)?\.js(\W|$)/i;for(var i=0;i<_47.length;i++){var src=_47[i].getAttribute("src");if(!src){continue;}var m=src.match(_48);if(m){if(!d.config.baseUrl){d.config.baseUrl=src.substring(0,m.index);}var cfg=(_47[i].getAttribute("djConfig")||_47[i].getAttribute("data-dojo-config"));if(cfg){var _49=eval("({ "+cfg+" })");for(var x in _49){dojo.config[x]=_49[x];}}break;}}}d.baseUrl=d.config.baseUrl;var n=navigator;var dua=n.userAgent,dav=n.appVersion,tv=parseFloat(dav);if(dua.indexOf("Opera")>=0){d.isOpera=tv;}if(dua.indexOf("AdobeAIR")>=0){d.isAIR=1;}d.isKhtml=(dav.indexOf("Konqueror")>=0)?tv:0;d.isWebKit=parseFloat(dua.split("WebKit/")[1])||undefined;d.isChrome=parseFloat(dua.split("Chrome/")[1])||undefined;d.isMac=dav.indexOf("Macintosh")>=0;var _4a=Math.max(dav.indexOf("WebKit"),dav.indexOf("Safari"),0);if(_4a&&!dojo.isChrome){d.isSafari=parseFloat(dav.split("Version/")[1]);if(!d.isSafari||parseFloat(dav.substr(_4a+7))<=419.3){d.isSafari=2;}}if(dua.indexOf("Gecko")>=0&&!d.isKhtml&&!d.isWebKit){d.isMozilla=d.isMoz=tv;}if(d.isMoz){d.isFF=parseFloat(dua.split("Firefox/")[1]||dua.split("Minefield/")[1])||undefined;}if(document.all&&!d.isOpera){d.isIE=parseFloat(dav.split("MSIE ")[1])||undefined;var _4b=document.documentMode;if(_4b&&_4b!=5&&Math.floor(d.isIE)!=_4b){d.isIE=_4b;}}if(dojo.isIE&&window.location.protocol==="file:"){dojo.config.ieForceActiveXXhr=true;}d.isQuirks=document.compatMode=="BackCompat";d.locale=dojo.config.locale||(d.isIE?n.userLanguage:n.language).toLowerCase();d._XMLHTTP_PROGIDS=["Msxml2.XMLHTTP","Microsoft.XMLHTTP","Msxml2.XMLHTTP.4.0"];d._xhrObj=function(){var _4c,_4d;if(!dojo.isIE||!dojo.config.ieForceActiveXXhr){try{_4c=new XMLHttpRequest();}catch(e){}}if(!_4c){for(var i=0;i<3;++i){var _4e=d._XMLHTTP_PROGIDS[i];try{_4c=new ActiveXObject(_4e);}catch(e){_4d=e;}if(_4c){d._XMLHTTP_PROGIDS=[_4e];break;}}}if(!_4c){throw new Error("XMLHTTP not available: "+_4d);}return _4c;};d._isDocumentOk=function(_4f){var _50=_4f.status||0,lp=location.protocol;return (_50>=200&&_50<300)||_50==304||_50==1223||(!_50&&(lp=="file:"||lp=="chrome:"||lp=="chrome-extension:"||lp=="app:"));};var _51=window.location+"";var _52=document.getElementsByTagName("base");var _53=(_52&&_52.length>0);d._getText=function(uri,_54){var _55=d._xhrObj();if(!_53&&dojo._Url){uri=(new dojo._Url(_51,uri)).toString();}if(d.config.cacheBust){uri+="";uri+=(uri.indexOf("?")==-1?"?":"&")+String(d.config.cacheBust).replace(/\W+/g,"");}_55.open("GET",uri,false);try{_55.send(null);if(!d._isDocumentOk(_55)){var err=Error("Unable to load "+uri+" status:"+_55.status);err.status=_55.status;err.responseText=_55.responseText;throw err;}}catch(e){if(_54){return null;}throw e;}return _55.responseText;};var _56=window;var _57=function(_58,fp){var _59=_56.attachEvent||_56.addEventListener;_58=_56.attachEvent?_58:_58.substring(2);_59(_58,function(){fp.apply(_56,arguments);},false);};d._windowUnloaders=[];d.windowUnloaded=function(){var mll=d._windowUnloaders;while(mll.length){(mll.pop())();}d=null;};var _5a=0;d.addOnWindowUnload=function(obj,_5b){d._onto(d._windowUnloaders,obj,_5b);if(!_5a){_5a=1;_57("onunload",d.windowUnloaded);}};var _5c=0;d.addOnUnload=function(obj,_5d){d._onto(d._unloaders,obj,_5d);if(!_5c){_5c=1;_57("onbeforeunload",dojo.unloaded);}};})();dojo._initFired=false;dojo._loadInit=function(e){if(dojo._scrollIntervalId){clearInterval(dojo._scrollIntervalId);dojo._scrollIntervalId=0;}if(!dojo._initFired){dojo._initFired=true;if(!dojo.config.afterOnLoad&&window.detachEvent){window.detachEvent("onload",dojo._loadInit);}if(dojo._inFlightCount==0){dojo._modulesLoaded();}}};if(!dojo.config.afterOnLoad){if(document.addEventListener){document.addEventListener("DOMContentLoaded",dojo._loadInit,false);window.addEventListener("load",dojo._loadInit,false);}else{if(window.attachEvent){window.attachEvent("onload",dojo._loadInit);if(!dojo.config.skipIeDomLoaded&&self===self.top){dojo._scrollIntervalId=setInterval(function(){try{if(document.body){document.documentElement.doScroll("left");dojo._loadInit();}}catch(e){}},30);}}}}if(dojo.isIE){try{(function(){document.namespaces.add("v","urn:schemas-microsoft-com:vml");var _5e=["*","group","roundrect","oval","shape","rect","imagedata","path","textpath","text"],i=0,l=1,s=document.createStyleSheet();if(dojo.isIE>=8){i=1;l=_5e.length;}for(;i<l;++i){s.addRule("v\\:"+_5e[i],"behavior:url(#default#VML); display:inline-block");}})();}catch(e){}}}(function(){var mp=dojo.config["modulePaths"];if(mp){for(var _5f in mp){dojo.registerModulePath(_5f,mp[_5f]);}}})();if(dojo.config.isDebug){dojo.require("dojo._firebug.firebug");}if(dojo.config.debugAtAllCosts){dojo.require("dojo._base._loader.loader_debug");dojo.require("dojo.i18n");}if(!dojo._hasResource["dojo._base.lang"]){dojo._hasResource["dojo._base.lang"]=true;dojo.provide("dojo._base.lang");(function(){var d=dojo,_60=Object.prototype.toString;dojo.isString=function(it){return (typeof it=="string"||it instanceof String);};dojo.isArray=function(it){return it&&(it instanceof Array||typeof it=="array");};dojo.isFunction=function(it){return _60.call(it)==="[object Function]";};dojo.isObject=function(it){return it!==undefined&&(it===null||typeof it=="object"||d.isArray(it)||d.isFunction(it));};dojo.isArrayLike=function(it){return it&&it!==undefined&&!d.isString(it)&&!d.isFunction(it)&&!(it.tagName&&it.tagName.toLowerCase()=="form")&&(d.isArray(it)||isFinite(it.length));};dojo.isAlien=function(it){return it&&!d.isFunction(it)&&/\{\s*\[native code\]\s*\}/.test(String(it));};dojo.extend=function(_61,_62){for(var i=1,l=arguments.length;i<l;i++){d._mixin(_61.prototype,arguments[i]);}return _61;};dojo._hitchArgs=function(_63,_64){var pre=d._toArray(arguments,2);var _65=d.isString(_64);return function(){var _66=d._toArray(arguments);var f=_65?(_63||d.global)[_64]:_64;return f&&f.apply(_63||this,pre.concat(_66));};};dojo.hitch=function(_67,_68){if(arguments.length>2){return d._hitchArgs.apply(d,arguments);}if(!_68){_68=_67;_67=null;}if(d.isString(_68)){_67=_67||d.global;if(!_67[_68]){throw (["dojo.hitch: scope[\"",_68,"\"] is null (scope=\"",_67,"\")"].join(""));}return function(){return _67[_68].apply(_67,arguments||[]);};}return !_67?_68:function(){return _68.apply(_67,arguments||[]);};};dojo.delegate=dojo._delegate=(function(){function TMP(){};return function(obj,_69){TMP.prototype=obj;var tmp=new TMP();TMP.prototype=null;if(_69){d._mixin(tmp,_69);}return tmp;};})();var _6a=function(obj,_6b,_6c){return (_6c||[]).concat(Array.prototype.slice.call(obj,_6b||0));};var _6d=function(obj,_6e,_6f){var arr=_6f||[];for(var x=_6e||0;x<obj.length;x++){arr.push(obj[x]);}return arr;};dojo._toArray=d.isIE?function(obj){return ((obj.item)?_6d:_6a).apply(this,arguments);}:_6a;dojo.partial=function(_70){var arr=[null];return d.hitch.apply(d,arr.concat(d._toArray(arguments)));};var _71=d._extraNames,_72=_71.length,_73={};dojo.clone=function(o){if(!o||typeof o!="object"||d.isFunction(o)){return o;}if(o.nodeType&&"cloneNode" in o){return o.cloneNode(true);}if(o instanceof Date){return new Date(o.getTime());}if(o instanceof RegExp){return new RegExp(o);}var r,i,l,s,_74;if(d.isArray(o)){r=[];for(i=0,l=o.length;i<l;++i){if(i in o){r.push(d.clone(o[i]));}}}else{r=o.constructor?new o.constructor():{};}for(_74 in o){s=o[_74];if(!(_74 in r)||(r[_74]!==s&&(!(_74 in _73)||_73[_74]!==s))){r[_74]=d.clone(s);}}if(_72){for(i=0;i<_72;++i){_74=_71[i];s=o[_74];if(!(_74 in r)||(r[_74]!==s&&(!(_74 in _73)||_73[_74]!==s))){r[_74]=s;}}}return r;};dojo.trim=String.prototype.trim?function(str){return str.trim();}:function(str){return str.replace(/^\s\s*/,"").replace(/\s\s*$/,"");};var _75=/\{([^\}]+)\}/g;dojo.replace=function(_76,map,_77){return _76.replace(_77||_75,d.isFunction(map)?map:function(_78,k){return d.getObject(k,false,map);});};})();}if(!dojo._hasResource["dojo._base.array"]){dojo._hasResource["dojo._base.array"]=true;dojo.provide("dojo._base.array");(function(){var _79=function(arr,obj,cb){return [(typeof arr=="string")?arr.split(""):arr,obj||dojo.global,(typeof cb=="string")?new Function("item","index","array",cb):cb];};var _7a=function(_7b,arr,_7c,_7d){var _7e=_79(arr,_7d,_7c);arr=_7e[0];for(var i=0,l=arr.length;i<l;++i){var _7f=!!_7e[2].call(_7e[1],arr[i],i,arr);if(_7b^_7f){return _7f;}}return _7b;};dojo.mixin(dojo,{indexOf:function(_80,_81,_82,_83){var _84=1,end=_80.length||0,i=0;if(_83){i=end-1;_84=end=-1;}if(_82!=undefined){i=_82;}if((_83&&i>end)||i<end){for(;i!=end;i+=_84){if(_80[i]==_81){return i;}}}return -1;},lastIndexOf:function(_85,_86,_87){return dojo.indexOf(_85,_86,_87,true);},forEach:function(arr,_88,_89){if(!arr||!arr.length){return;}var _8a=_79(arr,_89,_88);arr=_8a[0];for(var i=0,l=arr.length;i<l;++i){_8a[2].call(_8a[1],arr[i],i,arr);}},every:function(arr,_8b,_8c){return _7a(true,arr,_8b,_8c);},some:function(arr,_8d,_8e){return _7a(false,arr,_8d,_8e);},map:function(arr,_8f,_90){var _91=_79(arr,_90,_8f);arr=_91[0];var _92=(arguments[3]?(new arguments[3]()):[]);for(var i=0,l=arr.length;i<l;++i){_92.push(_91[2].call(_91[1],arr[i],i,arr));}return _92;},filter:function(arr,_93,_94){var _95=_79(arr,_94,_93);arr=_95[0];var _96=[];for(var i=0,l=arr.length;i<l;++i){if(_95[2].call(_95[1],arr[i],i,arr)){_96.push(arr[i]);}}return _96;}});})();}if(!dojo._hasResource["dojo._base.declare"]){dojo._hasResource["dojo._base.declare"]=true;dojo.provide("dojo._base.declare");(function(){var d=dojo,mix=d._mixin,op=Object.prototype,_97=op.toString,_98=new Function,_99=0,_9a="constructor";function err(msg,cls){throw new Error("declare"+(cls?" "+cls:"")+": "+msg);};function _9b(_9c,_9d){var _9e=[],_9f=[{cls:0,refs:[]}],_a0={},_a1=1,l=_9c.length,i=0,j,lin,_a2,top,_a3,rec,_a4,_a5;for(;i<l;++i){_a2=_9c[i];if(!_a2){err("mixin #"+i+" is unknown. Did you use dojo.require to pull it in?",_9d);}else{if(_97.call(_a2)!="[object Function]"){err("mixin #"+i+" is not a callable constructor.",_9d);}}lin=_a2._meta?_a2._meta.bases:[_a2];top=0;for(j=lin.length-1;j>=0;--j){_a3=lin[j].prototype;if(!_a3.hasOwnProperty("declaredClass")){_a3.declaredClass="uniqName_"+(_99++);}_a4=_a3.declaredClass;if(!_a0.hasOwnProperty(_a4)){_a0[_a4]={count:0,refs:[],cls:lin[j]};++_a1;}rec=_a0[_a4];if(top&&top!==rec){rec.refs.push(top);++top.count;}top=rec;}++top.count;_9f[0].refs.push(top);}while(_9f.length){top=_9f.pop();_9e.push(top.cls);--_a1;while(_a5=top.refs,_a5.length==1){top=_a5[0];if(!top||--top.count){top=0;break;}_9e.push(top.cls);--_a1;}if(top){for(i=0,l=_a5.length;i<l;++i){top=_a5[i];if(!--top.count){_9f.push(top);}}}}if(_a1){err("can't build consistent linearization",_9d);}_a2=_9c[0];_9e[0]=_a2?_a2._meta&&_a2===_9e[_9e.length-_a2._meta.bases.length]?_a2._meta.bases.length:1:0;return _9e;};function _a6(_a7,a,f){var _a8,_a9,_aa,_ab,_ac,_ad,_ae,opf,pos,_af=this._inherited=this._inherited||{};if(typeof _a7=="string"){_a8=_a7;_a7=a;a=f;}f=0;_ab=_a7.callee;_a8=_a8||_ab.nom;if(!_a8){err("can't deduce a name to call inherited()",this.declaredClass);}_ac=this.constructor._meta;_aa=_ac.bases;pos=_af.p;if(_a8!=_9a){if(_af.c!==_ab){pos=0;_ad=_aa[0];_ac=_ad._meta;if(_ac.hidden[_a8]!==_ab){_a9=_ac.chains;if(_a9&&typeof _a9[_a8]=="string"){err("calling chained method with inherited: "+_a8,this.declaredClass);}do{_ac=_ad._meta;_ae=_ad.prototype;if(_ac&&(_ae[_a8]===_ab&&_ae.hasOwnProperty(_a8)||_ac.hidden[_a8]===_ab)){break;}}while(_ad=_aa[++pos]);pos=_ad?pos:-1;}}_ad=_aa[++pos];if(_ad){_ae=_ad.prototype;if(_ad._meta&&_ae.hasOwnProperty(_a8)){f=_ae[_a8];}else{opf=op[_a8];do{_ae=_ad.prototype;f=_ae[_a8];if(f&&(_ad._meta?_ae.hasOwnProperty(_a8):f!==opf)){break;}}while(_ad=_aa[++pos]);}}f=_ad&&f||op[_a8];}else{if(_af.c!==_ab){pos=0;_ac=_aa[0]._meta;if(_ac&&_ac.ctor!==_ab){_a9=_ac.chains;if(!_a9||_a9.constructor!=="manual"){err("calling chained constructor with inherited",this.declaredClass);}while(_ad=_aa[++pos]){_ac=_ad._meta;if(_ac&&_ac.ctor===_ab){break;}}pos=_ad?pos:-1;}}while(_ad=_aa[++pos]){_ac=_ad._meta;f=_ac?_ac.ctor:_ad;if(f){break;}}f=_ad&&f;}_af.c=f;_af.p=pos;if(f){return a===true?f:f.apply(this,a||_a7);}};function _b0(_b1,_b2){if(typeof _b1=="string"){return this.inherited(_b1,_b2,true);}return this.inherited(_b1,true);};function _b3(cls){var _b4=this.constructor._meta.bases;for(var i=0,l=_b4.length;i<l;++i){if(_b4[i]===cls){return true;}}return this instanceof cls;};function _b5(_b6,_b7){var _b8,i=0,l=d._extraNames.length;for(_b8 in _b7){if(_b8!=_9a&&_b7.hasOwnProperty(_b8)){_b6[_b8]=_b7[_b8];}}for(;i<l;++i){_b8=d._extraNames[i];if(_b8!=_9a&&_b7.hasOwnProperty(_b8)){_b6[_b8]=_b7[_b8];}}};function _b9(_ba,_bb){var _bc,t,i=0,l=d._extraNames.length;for(_bc in _bb){t=_bb[_bc];if((t!==op[_bc]||!(_bc in op))&&_bc!=_9a){if(_97.call(t)=="[object Function]"){t.nom=_bc;}_ba[_bc]=t;}}for(;i<l;++i){_bc=d._extraNames[i];t=_bb[_bc];if((t!==op[_bc]||!(_bc in op))&&_bc!=_9a){if(_97.call(t)=="[object Function]"){t.nom=_bc;}_ba[_bc]=t;}}return _ba;};function _bd(_be){_b9(this.prototype,_be);return this;};function _bf(_c0,_c1){return function(){var a=arguments,_c2=a,a0=a[0],f,i,m,l=_c0.length,_c3;if(!(this instanceof a.callee)){return _c4(a);}if(_c1&&(a0&&a0.preamble||this.preamble)){_c3=new Array(_c0.length);_c3[0]=a;for(i=0;;){a0=a[0];if(a0){f=a0.preamble;if(f){a=f.apply(this,a)||a;}}f=_c0[i].prototype;f=f.hasOwnProperty("preamble")&&f.preamble;if(f){a=f.apply(this,a)||a;}if(++i==l){break;}_c3[i]=a;}}for(i=l-1;i>=0;--i){f=_c0[i];m=f._meta;f=m?m.ctor:f;if(f){f.apply(this,_c3?_c3[i]:a);}}f=this.postscript;if(f){f.apply(this,_c2);}};};function _c5(_c6,_c7){return function(){var a=arguments,t=a,a0=a[0],f;if(!(this instanceof a.callee)){return _c4(a);}if(_c7){if(a0){f=a0.preamble;if(f){t=f.apply(this,t)||t;}}f=this.preamble;if(f){f.apply(this,t);}}if(_c6){_c6.apply(this,a);}f=this.postscript;if(f){f.apply(this,a);}};};function _c8(_c9){return function(){var a=arguments,i=0,f,m;if(!(this instanceof a.callee)){return _c4(a);}for(;f=_c9[i];++i){m=f._meta;f=m?m.ctor:f;if(f){f.apply(this,a);break;}}f=this.postscript;if(f){f.apply(this,a);}};};function _ca(_cb,_cc,_cd){return function(){var b,m,f,i=0,_ce=1;if(_cd){i=_cc.length-1;_ce=-1;}for(;b=_cc[i];i+=_ce){m=b._meta;f=(m?m.hidden:b.prototype)[_cb];if(f){f.apply(this,arguments);}}};};function _cf(_d0){_98.prototype=_d0.prototype;var t=new _98;_98.prototype=null;return t;};function _c4(_d1){var _d2=_d1.callee,t=_cf(_d2);_d2.apply(t,_d1);return t;};d.declare=function(_d3,_d4,_d5){if(typeof _d3!="string"){_d5=_d4;_d4=_d3;_d3="";}_d5=_d5||{};var _d6,i,t,_d7,_d8,_d9,_da,_db=1,_dc=_d4;if(_97.call(_d4)=="[object Array]"){_d9=_9b(_d4,_d3);t=_d9[0];_db=_d9.length-t;_d4=_d9[_db];}else{_d9=[0];if(_d4){if(_97.call(_d4)=="[object Function]"){t=_d4._meta;_d9=_d9.concat(t?t.bases:_d4);}else{err("base class is not a callable constructor.",_d3);}}else{if(_d4!==null){err("unknown base class. Did you use dojo.require to pull it in?",_d3);}}}if(_d4){for(i=_db-1;;--i){_d6=_cf(_d4);if(!i){break;}t=_d9[i];(t._meta?_b5:mix)(_d6,t.prototype);_d7=new Function;_d7.superclass=_d4;_d7.prototype=_d6;_d4=_d6.constructor=_d7;}}else{_d6={};}_b9(_d6,_d5);t=_d5.constructor;if(t!==op.constructor){t.nom=_9a;_d6.constructor=t;}for(i=_db-1;i;--i){t=_d9[i]._meta;if(t&&t.chains){_da=mix(_da||{},t.chains);}}if(_d6["-chains-"]){_da=mix(_da||{},_d6["-chains-"]);}t=!_da||!_da.hasOwnProperty(_9a);_d9[0]=_d7=(_da&&_da.constructor==="manual")?_c8(_d9):(_d9.length==1?_c5(_d5.constructor,t):_bf(_d9,t));_d7._meta={bases:_d9,hidden:_d5,chains:_da,parents:_dc,ctor:_d5.constructor};_d7.superclass=_d4&&_d4.prototype;_d7.extend=_bd;_d7.prototype=_d6;_d6.constructor=_d7;_d6.getInherited=_b0;_d6.inherited=_a6;_d6.isInstanceOf=_b3;if(_d3){_d6.declaredClass=_d3;d.setObject(_d3,_d7);}if(_da){for(_d8 in _da){if(_d6[_d8]&&typeof _da[_d8]=="string"&&_d8!=_9a){t=_d6[_d8]=_ca(_d8,_d9,_da[_d8]==="after");t.nom=_d8;}}}return _d7;};d.safeMixin=_b9;})();}if(!dojo._hasResource["dojo._base.connect"]){dojo._hasResource["dojo._base.connect"]=true;dojo.provide("dojo._base.connect");dojo._listener={getDispatcher:function(){return function(){var ap=Array.prototype,c=arguments.callee,ls=c._listeners,t=c.target,r=t&&t.apply(this,arguments),i,lls=[].concat(ls);for(i in lls){if(!(i in ap)){lls[i].apply(this,arguments);}}return r;};},add:function(_dd,_de,_df){_dd=_dd||dojo.global;var f=_dd[_de];if(!f||!f._listeners){var d=dojo._listener.getDispatcher();d.target=f;d._listeners=[];f=_dd[_de]=d;}return f._listeners.push(_df);},remove:function(_e0,_e1,_e2){var f=(_e0||dojo.global)[_e1];if(f&&f._listeners&&_e2--){delete f._listeners[_e2];}}};dojo.connect=function(obj,_e3,_e4,_e5,_e6){var a=arguments,_e7=[],i=0;_e7.push(dojo.isString(a[0])?null:a[i++],a[i++]);var a1=a[i+1];_e7.push(dojo.isString(a1)||dojo.isFunction(a1)?a[i++]:null,a[i++]);for(var l=a.length;i<l;i++){_e7.push(a[i]);}return dojo._connect.apply(this,_e7);};dojo._connect=function(obj,_e8,_e9,_ea){var l=dojo._listener,h=l.add(obj,_e8,dojo.hitch(_e9,_ea));return [obj,_e8,h,l];};dojo.disconnect=function(_eb){if(_eb&&_eb[0]!==undefined){dojo._disconnect.apply(this,_eb);delete _eb[0];}};dojo._disconnect=function(obj,_ec,_ed,_ee){_ee.remove(obj,_ec,_ed);};dojo._topics={};dojo.subscribe=function(_ef,_f0,_f1){return [_ef,dojo._listener.add(dojo._topics,_ef,dojo.hitch(_f0,_f1))];};dojo.unsubscribe=function(_f2){if(_f2){dojo._listener.remove(dojo._topics,_f2[0],_f2[1]);}};dojo.publish=function(_f3,_f4){var f=dojo._topics[_f3];if(f){f.apply(this,_f4||[]);}};dojo.connectPublisher=function(_f5,obj,_f6){var pf=function(){dojo.publish(_f5,arguments);};return _f6?dojo.connect(obj,_f6,pf):dojo.connect(obj,pf);};}if(!dojo._hasResource["dojo._base.Deferred"]){dojo._hasResource["dojo._base.Deferred"]=true;dojo.provide("dojo._base.Deferred");(function(){var _f7=function(){};var _f8=Object.freeze||function(){};dojo.Deferred=function(_f9){var _fa,_fb,_fc,_fd,_fe;var _ff=(this.promise={});function _100(_101){if(_fb){throw new Error("This deferred has already been resolved");}_fa=_101;_fb=true;_102();};function _102(){var _103;while(!_103&&_fe){var _104=_fe;_fe=_fe.next;if((_103=(_104.progress==_f7))){_fb=false;}var func=(_fc?_104.error:_104.resolved);if(func){try{var _105=func(_fa);if(_105&&typeof _105.then==="function"){_105.then(dojo.hitch(_104.deferred,"resolve"),dojo.hitch(_104.deferred,"reject"));continue;}var _106=_103&&_105===undefined;if(_103&&!_106){_fc=_105 instanceof Error;}_104.deferred[_106&&_fc?"reject":"resolve"](_106?_fa:_105);}catch(e){_104.deferred.reject(e);}}else{if(_fc){_104.deferred.reject(_fa);}else{_104.deferred.resolve(_fa);}}}};this.resolve=this.callback=function(_107){this.fired=0;this.results=[_107,null];_100(_107);};this.reject=this.errback=function(_108){_fc=true;this.fired=1;_100(_108);this.results=[null,_108];if(!_108||_108.log!==false){(dojo.config.deferredOnError||function(x){console.error(x);})(_108);}};this.progress=function(_109){var _10a=_fe;while(_10a){var _10b=_10a.progress;_10b&&_10b(_109);_10a=_10a.next;}};this.addCallbacks=function(_10c,_10d){this.then(_10c,_10d,_f7);return this;};this.then=_ff.then=function(_10e,_10f,_110){var _111=_110==_f7?this:new dojo.Deferred(_ff.cancel);var _112={resolved:_10e,error:_10f,progress:_110,deferred:_111};if(_fe){_fd=_fd.next=_112;}else{_fe=_fd=_112;}if(_fb){_102();}return _111.promise;};var _113=this;this.cancel=_ff.cancel=function(){if(!_fb){var _114=_f9&&_f9(_113);if(!_fb){if(!(_114 instanceof Error)){_114=new Error(_114);}_114.log=false;_113.reject(_114);}}};_f8(_ff);};dojo.extend(dojo.Deferred,{addCallback:function(_115){return this.addCallbacks(dojo.hitch.apply(dojo,arguments));},addErrback:function(_116){return this.addCallbacks(null,dojo.hitch.apply(dojo,arguments));},addBoth:function(_117){var _118=dojo.hitch.apply(dojo,arguments);return this.addCallbacks(_118,_118);},fired:-1});})();dojo.when=function(_119,_11a,_11b,_11c){if(_119&&typeof _119.then==="function"){return _119.then(_11a,_11b,_11c);}return _11a(_119);};}if(!dojo._hasResource["dojo._base.json"]){dojo._hasResource["dojo._base.json"]=true;dojo.provide("dojo._base.json");dojo.fromJson=function(json){return eval("("+json+")");};dojo._escapeString=function(str){return ("\""+str.replace(/(["\\])/g,"\\$1")+"\"").replace(/[\f]/g,"\\f").replace(/[\b]/g,"\\b").replace(/[\n]/g,"\\n").replace(/[\t]/g,"\\t").replace(/[\r]/g,"\\r");};dojo.toJsonIndentStr="\t";dojo.toJson=function(it,_11d,_11e){if(it===undefined){return "undefined";}var _11f=typeof it;if(_11f=="number"||_11f=="boolean"){return it+"";}if(it===null){return "null";}if(dojo.isString(it)){return dojo._escapeString(it);}var _120=arguments.callee;var _121;_11e=_11e||"";var _122=_11d?_11e+dojo.toJsonIndentStr:"";var tf=it.__json__||it.json;if(dojo.isFunction(tf)){_121=tf.call(it);if(it!==_121){return _120(_121,_11d,_122);}}if(it.nodeType&&it.cloneNode){throw new Error("Can't serialize DOM nodes");}var sep=_11d?" ":"";var _123=_11d?"\n":"";if(dojo.isArray(it)){var res=dojo.map(it,function(obj){var val=_120(obj,_11d,_122);if(typeof val!="string"){val="undefined";}return _123+_122+val;});return "["+res.join(","+sep)+_123+_11e+"]";}if(_11f=="function"){return null;}var _124=[],key;for(key in it){var _125,val;if(typeof key=="number"){_125="\""+key+"\"";}else{if(typeof key=="string"){_125=dojo._escapeString(key);}else{continue;}}val=_120(it[key],_11d,_122);if(typeof val!="string"){continue;}_124.push(_123+_122+_125+":"+sep+val);}return "{"+_124.join(","+sep)+_123+_11e+"}";};}if(!dojo._hasResource["dojo._base.Color"]){dojo._hasResource["dojo._base.Color"]=true;dojo.provide("dojo._base.Color");(function(){var d=dojo;dojo.Color=function(_126){if(_126){this.setColor(_126);}};dojo.Color.named={black:[0,0,0],silver:[192,192,192],gray:[128,128,128],white:[255,255,255],maroon:[128,0,0],red:[255,0,0],purple:[128,0,128],fuchsia:[255,0,255],green:[0,128,0],lime:[0,255,0],olive:[128,128,0],yellow:[255,255,0],navy:[0,0,128],blue:[0,0,255],teal:[0,128,128],aqua:[0,255,255],transparent:d.config.transparentColor||[255,255,255]};dojo.extend(dojo.Color,{r:255,g:255,b:255,a:1,_set:function(r,g,b,a){var t=this;t.r=r;t.g=g;t.b=b;t.a=a;},setColor:function(_127){if(d.isString(_127)){d.colorFromString(_127,this);}else{if(d.isArray(_127)){d.colorFromArray(_127,this);}else{this._set(_127.r,_127.g,_127.b,_127.a);if(!(_127 instanceof d.Color)){this.sanitize();}}}return this;},sanitize:function(){return this;},toRgb:function(){var t=this;return [t.r,t.g,t.b];},toRgba:function(){var t=this;return [t.r,t.g,t.b,t.a];},toHex:function(){var arr=d.map(["r","g","b"],function(x){var s=this[x].toString(16);return s.length<2?"0"+s:s;},this);return "#"+arr.join("");},toCss:function(_128){var t=this,rgb=t.r+", "+t.g+", "+t.b;return (_128?"rgba("+rgb+", "+t.a:"rgb("+rgb)+")";},toString:function(){return this.toCss(true);}});dojo.blendColors=function(_129,end,_12a,obj){var t=obj||new d.Color();d.forEach(["r","g","b","a"],function(x){t[x]=_129[x]+(end[x]-_129[x])*_12a;if(x!="a"){t[x]=Math.round(t[x]);}});return t.sanitize();};dojo.colorFromRgb=function(_12b,obj){var m=_12b.toLowerCase().match(/^rgba?\(([\s\.,0-9]+)\)/);return m&&dojo.colorFromArray(m[1].split(/\s*,\s*/),obj);};dojo.colorFromHex=function(_12c,obj){var t=obj||new d.Color(),bits=(_12c.length==4)?4:8,mask=(1<<bits)-1;_12c=Number("0x"+_12c.substr(1));if(isNaN(_12c)){return null;}d.forEach(["b","g","r"],function(x){var c=_12c&mask;_12c>>=bits;t[x]=bits==4?17*c:c;});t.a=1;return t;};dojo.colorFromArray=function(a,obj){var t=obj||new d.Color();t._set(Number(a[0]),Number(a[1]),Number(a[2]),Number(a[3]));if(isNaN(t.a)){t.a=1;}return t.sanitize();};dojo.colorFromString=function(str,obj){var a=d.Color.named[str];return a&&d.colorFromArray(a,obj)||d.colorFromRgb(str,obj)||d.colorFromHex(str,obj);};})();}if(!dojo._hasResource["dojo._base.window"]){dojo._hasResource["dojo._base.window"]=true;dojo.provide("dojo._base.window");dojo.doc=window["document"]||null;dojo.body=function(){return dojo.doc.body||dojo.doc.getElementsByTagName("body")[0];};dojo.setContext=function(_12d,_12e){dojo.global=_12d;dojo.doc=_12e;};dojo.withGlobal=function(_12f,_130,_131,_132){var _133=dojo.global;try{dojo.global=_12f;return dojo.withDoc.call(null,_12f.document,_130,_131,_132);}finally{dojo.global=_133;}};dojo.withDoc=function(_134,_135,_136,_137){var _138=dojo.doc,_139=dojo._bodyLtr,oldQ=dojo.isQuirks;try{dojo.doc=_134;delete dojo._bodyLtr;dojo.isQuirks=dojo.doc.compatMode=="BackCompat";if(_136&&typeof _135=="string"){_135=_136[_135];}return _135.apply(_136,_137||[]);}finally{dojo.doc=_138;delete dojo._bodyLtr;if(_139!==undefined){dojo._bodyLtr=_139;}dojo.isQuirks=oldQ;}};}if(!dojo._hasResource["dojo._base.event"]){dojo._hasResource["dojo._base.event"]=true;dojo.provide("dojo._base.event");(function(){var del=(dojo._event_listener={add:function(node,name,fp){if(!node){return;}name=del._normalizeEventName(name);fp=del._fixCallback(name,fp);if(!dojo.isIE&&(name=="mouseenter"||name=="mouseleave")){var ofp=fp;name=(name=="mouseenter")?"mouseover":"mouseout";fp=function(e){if(!dojo.isDescendant(e.relatedTarget,node)){return ofp.call(this,e);}};}node.addEventListener(name,fp,false);return fp;},remove:function(node,_13a,_13b){if(node){_13a=del._normalizeEventName(_13a);if(!dojo.isIE&&(_13a=="mouseenter"||_13a=="mouseleave")){_13a=(_13a=="mouseenter")?"mouseover":"mouseout";}node.removeEventListener(_13a,_13b,false);}},_normalizeEventName:function(name){return name.slice(0,2)=="on"?name.slice(2):name;},_fixCallback:function(name,fp){return name!="keypress"?fp:function(e){return fp.call(this,del._fixEvent(e,this));};},_fixEvent:function(evt,_13c){switch(evt.type){case "keypress":del._setKeyChar(evt);break;}return evt;},_setKeyChar:function(evt){evt.keyChar=evt.charCode>=32?String.fromCharCode(evt.charCode):"";evt.charOrCode=evt.keyChar||evt.keyCode;},_punctMap:{106:42,111:47,186:59,187:43,188:44,189:45,190:46,191:47,192:96,219:91,220:92,221:93,222:39}});dojo.fixEvent=function(evt,_13d){return del._fixEvent(evt,_13d);};dojo.stopEvent=function(evt){evt.preventDefault();evt.stopPropagation();};var _13e=dojo._listener;dojo._connect=function(obj,_13f,_140,_141,_142){var _143=obj&&(obj.nodeType||obj.attachEvent||obj.addEventListener);var lid=_143?(_142?2:1):0,l=[dojo._listener,del,_13e][lid];var h=l.add(obj,_13f,dojo.hitch(_140,_141));return [obj,_13f,h,lid];};dojo._disconnect=function(obj,_144,_145,_146){([dojo._listener,del,_13e][_146]).remove(obj,_144,_145);};dojo.keys={BACKSPACE:8,TAB:9,CLEAR:12,ENTER:13,SHIFT:16,CTRL:17,ALT:18,META:dojo.isSafari?91:224,PAUSE:19,CAPS_LOCK:20,ESCAPE:27,SPACE:32,PAGE_UP:33,PAGE_DOWN:34,END:35,HOME:36,LEFT_ARROW:37,UP_ARROW:38,RIGHT_ARROW:39,DOWN_ARROW:40,INSERT:45,DELETE:46,HELP:47,LEFT_WINDOW:91,RIGHT_WINDOW:92,SELECT:93,NUMPAD_0:96,NUMPAD_1:97,NUMPAD_2:98,NUMPAD_3:99,NUMPAD_4:100,NUMPAD_5:101,NUMPAD_6:102,NUMPAD_7:103,NUMPAD_8:104,NUMPAD_9:105,NUMPAD_MULTIPLY:106,NUMPAD_PLUS:107,NUMPAD_ENTER:108,NUMPAD_MINUS:109,NUMPAD_PERIOD:110,NUMPAD_DIVIDE:111,F1:112,F2:113,F3:114,F4:115,F5:116,F6:117,F7:118,F8:119,F9:120,F10:121,F11:122,F12:123,F13:124,F14:125,F15:126,NUM_LOCK:144,SCROLL_LOCK:145,copyKey:dojo.isMac&&!dojo.isAIR?(dojo.isSafari?91:224):17};var _147=dojo.isMac?"metaKey":"ctrlKey";dojo.isCopyKey=function(e){return e[_147];};if(dojo.isIE<9||(dojo.isIE&&dojo.isQuirks)){dojo.mouseButtons={LEFT:1,MIDDLE:4,RIGHT:2,isButton:function(e,_148){return e.button&_148;},isLeft:function(e){return e.button&1;},isMiddle:function(e){return e.button&4;},isRight:function(e){return e.button&2;}};}else{dojo.mouseButtons={LEFT:0,MIDDLE:1,RIGHT:2,isButton:function(e,_149){return e.button==_149;},isLeft:function(e){return e.button==0;},isMiddle:function(e){return e.button==1;},isRight:function(e){return e.button==2;}};}if(dojo.isIE){var _14a=function(e,code){try{return (e.keyCode=code);}catch(e){return 0;}};var iel=dojo._listener;var _14b=(dojo._ieListenersName="_"+dojo._scopeName+"_listeners");if(!dojo.config._allow_leaks){_13e=iel=dojo._ie_listener={handlers:[],add:function(_14c,_14d,_14e){_14c=_14c||dojo.global;var f=_14c[_14d];if(!f||!f[_14b]){var d=dojo._getIeDispatcher();d.target=f&&(ieh.push(f)-1);d[_14b]=[];f=_14c[_14d]=d;}return f[_14b].push(ieh.push(_14e)-1);},remove:function(_14f,_150,_151){var f=(_14f||dojo.global)[_150],l=f&&f[_14b];if(f&&l&&_151--){delete ieh[l[_151]];delete l[_151];}}};var ieh=iel.handlers;}dojo.mixin(del,{add:function(node,_152,fp){if(!node){return;}_152=del._normalizeEventName(_152);if(_152=="onkeypress"){var kd=node.onkeydown;if(!kd||!kd[_14b]||!kd._stealthKeydownHandle){var h=del.add(node,"onkeydown",del._stealthKeyDown);kd=node.onkeydown;kd._stealthKeydownHandle=h;kd._stealthKeydownRefs=1;}else{kd._stealthKeydownRefs++;}}return iel.add(node,_152,del._fixCallback(fp));},remove:function(node,_153,_154){_153=del._normalizeEventName(_153);iel.remove(node,_153,_154);if(_153=="onkeypress"){var kd=node.onkeydown;if(--kd._stealthKeydownRefs<=0){iel.remove(node,"onkeydown",kd._stealthKeydownHandle);delete kd._stealthKeydownHandle;}}},_normalizeEventName:function(_155){return _155.slice(0,2)!="on"?"on"+_155:_155;},_nop:function(){},_fixEvent:function(evt,_156){if(!evt){var w=_156&&(_156.ownerDocument||_156.document||_156).parentWindow||window;evt=w.event;}if(!evt){return (evt);}evt.target=evt.srcElement;evt.currentTarget=(_156||evt.srcElement);evt.layerX=evt.offsetX;evt.layerY=evt.offsetY;var se=evt.srcElement,doc=(se&&se.ownerDocument)||document;var _157=((dojo.isIE<6)||(doc["compatMode"]=="BackCompat"))?doc.body:doc.documentElement;var _158=dojo._getIeDocumentElementOffset();evt.pageX=evt.clientX+dojo._fixIeBiDiScrollLeft(_157.scrollLeft||0)-_158.x;evt.pageY=evt.clientY+(_157.scrollTop||0)-_158.y;if(evt.type=="mouseover"){evt.relatedTarget=evt.fromElement;}if(evt.type=="mouseout"){evt.relatedTarget=evt.toElement;}if(dojo.isIE<9||dojo.isQuirks){evt.stopPropagation=del._stopPropagation;evt.preventDefault=del._preventDefault;}return del._fixKeys(evt);},_fixKeys:function(evt){switch(evt.type){case "keypress":var c=("charCode" in evt?evt.charCode:evt.keyCode);if(c==10){c=0;evt.keyCode=13;}else{if(c==13||c==27){c=0;}else{if(c==3){c=99;}}}evt.charCode=c;del._setKeyChar(evt);break;}return evt;},_stealthKeyDown:function(evt){var kp=evt.currentTarget.onkeypress;if(!kp||!kp[_14b]){return;}var k=evt.keyCode;var _159=(k!=13||(dojo.isIE>=9&&!dojo.isQuirks))&&k!=32&&k!=27&&(k<48||k>90)&&(k<96||k>111)&&(k<186||k>192)&&(k<219||k>222);if(_159||evt.ctrlKey){var c=_159?0:k;if(evt.ctrlKey){if(k==3||k==13){return;}else{if(c>95&&c<106){c-=48;}else{if((!evt.shiftKey)&&(c>=65&&c<=90)){c+=32;}else{c=del._punctMap[c]||c;}}}}var faux=del._synthesizeEvent(evt,{type:"keypress",faux:true,charCode:c});kp.call(evt.currentTarget,faux);if(dojo.isIE<9||(dojo.isIE&&dojo.isQuirks)){evt.cancelBubble=faux.cancelBubble;}evt.returnValue=faux.returnValue;_14a(evt,faux.keyCode);}},_stopPropagation:function(){this.cancelBubble=true;},_preventDefault:function(){this.bubbledKeyCode=this.keyCode;if(this.ctrlKey){_14a(this,0);}this.returnValue=false;}});dojo.stopEvent=(dojo.isIE<9||dojo.isQuirks)?function(evt){evt=evt||window.event;del._stopPropagation.call(evt);del._preventDefault.call(evt);}:dojo.stopEvent;}del._synthesizeEvent=function(evt,_15a){var faux=dojo.mixin({},evt,_15a);del._setKeyChar(faux);faux.preventDefault=function(){evt.preventDefault();};faux.stopPropagation=function(){evt.stopPropagation();};return faux;};if(dojo.isOpera){dojo.mixin(del,{_fixEvent:function(evt,_15b){switch(evt.type){case "keypress":var c=evt.which;if(c==3){c=99;}c=c<41&&!evt.shiftKey?0:c;if(evt.ctrlKey&&!evt.shiftKey&&c>=65&&c<=90){c+=32;}return del._synthesizeEvent(evt,{charCode:c});}return evt;}});}if(dojo.isWebKit){del._add=del.add;del._remove=del.remove;dojo.mixin(del,{add:function(node,_15c,fp){if(!node){return;}var _15d=del._add(node,_15c,fp);if(del._normalizeEventName(_15c)=="keypress"){_15d._stealthKeyDownHandle=del._add(node,"keydown",function(evt){var k=evt.keyCode;var _15e=k!=13&&k!=32&&(k<48||k>90)&&(k<96||k>111)&&(k<186||k>192)&&(k<219||k>222);if(_15e||evt.ctrlKey){var c=_15e?0:k;if(evt.ctrlKey){if(k==3||k==13){return;}else{if(c>95&&c<106){c-=48;}else{if(!evt.shiftKey&&c>=65&&c<=90){c+=32;}else{c=del._punctMap[c]||c;}}}}var faux=del._synthesizeEvent(evt,{type:"keypress",faux:true,charCode:c});fp.call(evt.currentTarget,faux);}});}return _15d;},remove:function(node,_15f,_160){if(node){if(_160._stealthKeyDownHandle){del._remove(node,"keydown",_160._stealthKeyDownHandle);}del._remove(node,_15f,_160);}},_fixEvent:function(evt,_161){switch(evt.type){case "keypress":if(evt.faux){return evt;}var c=evt.charCode;c=c>=32?c:0;return del._synthesizeEvent(evt,{charCode:c,faux:true});}return evt;}});}})();if(dojo.isIE){dojo._ieDispatcher=function(args,_162){var ap=Array.prototype,h=dojo._ie_listener.handlers,c=args.callee,ls=c[dojo._ieListenersName],t=h[c.target];var r=t&&t.apply(_162,args);var lls=[].concat(ls);for(var i in lls){var f=h[lls[i]];if(!(i in ap)&&f){f.apply(_162,args);}}return r;};dojo._getIeDispatcher=function(){return new Function(dojo._scopeName+"._ieDispatcher(arguments, this)");};dojo._event_listener._fixCallback=function(fp){var f=dojo._event_listener._fixEvent;return function(e){return fp.call(this,f(e,this));};};}}if(!dojo._hasResource["dojo._base.html"]){dojo._hasResource["dojo._base.html"]=true;dojo.provide("dojo._base.html");try{document.execCommand("BackgroundImageCache",false,true);}catch(e){}if(dojo.isIE){dojo.byId=function(id,doc){if(typeof id!="string"){return id;}var _163=doc||dojo.doc,te=_163.getElementById(id);if(te&&(te.attributes.id.value==id||te.id==id)){return te;}else{var eles=_163.all[id];if(!eles||eles.nodeName){eles=[eles];}var i=0;while((te=eles[i++])){if((te.attributes&&te.attributes.id&&te.attributes.id.value==id)||te.id==id){return te;}}}};}else{dojo.byId=function(id,doc){return ((typeof id=="string")?(doc||dojo.doc).getElementById(id):id)||null;};}(function(){var d=dojo;var byId=d.byId;var _164=null,_165;d.addOnWindowUnload(function(){_164=null;});dojo._destroyElement=dojo.destroy=function(node){node=byId(node);try{var doc=node.ownerDocument;if(!_164||_165!=doc){_164=doc.createElement("div");_165=doc;}_164.appendChild(node.parentNode?node.parentNode.removeChild(node):node);_164.innerHTML="";}catch(e){}};dojo.isDescendant=function(node,_166){try{node=byId(node);_166=byId(_166);while(node){if(node==_166){return true;}node=node.parentNode;}}catch(e){}return false;};dojo.setSelectable=function(node,_167){node=byId(node);if(d.isMozilla){node.style.MozUserSelect=_167?"":"none";}else{if(d.isKhtml||d.isWebKit){node.style.KhtmlUserSelect=_167?"auto":"none";}else{if(d.isIE){var v=(node.unselectable=_167?"":"on");d.query("*",node).forEach("item.unselectable = '"+v+"'");}}}};var _168=function(node,ref){var _169=ref.parentNode;if(_169){_169.insertBefore(node,ref);}};var _16a=function(node,ref){var _16b=ref.parentNode;if(_16b){if(_16b.lastChild==ref){_16b.appendChild(node);}else{_16b.insertBefore(node,ref.nextSibling);}}};dojo.place=function(node,_16c,_16d){_16c=byId(_16c);if(typeof node=="string"){node=/^\s*</.test(node)?d._toDom(node,_16c.ownerDocument):byId(node);}if(typeof _16d=="number"){var cn=_16c.childNodes;if(!cn.length||cn.length<=_16d){_16c.appendChild(node);}else{_168(node,cn[_16d<0?0:_16d]);}}else{switch(_16d){case "before":_168(node,_16c);break;case "after":_16a(node,_16c);break;case "replace":_16c.parentNode.replaceChild(node,_16c);break;case "only":d.empty(_16c);_16c.appendChild(node);break;case "first":if(_16c.firstChild){_168(node,_16c.firstChild);break;}default:_16c.appendChild(node);}}return node;};dojo.boxModel="content-box";if(d.isIE){d.boxModel=document.compatMode=="BackCompat"?"border-box":"content-box";}var gcs;if(d.isWebKit){gcs=function(node){var s;if(node.nodeType==1){var dv=node.ownerDocument.defaultView;s=dv.getComputedStyle(node,null);if(!s&&node.style){node.style.display="";s=dv.getComputedStyle(node,null);}}return s||{};};}else{if(d.isIE){gcs=function(node){return node.nodeType==1?node.currentStyle:{};};}else{gcs=function(node){return node.nodeType==1?node.ownerDocument.defaultView.getComputedStyle(node,null):{};};}}dojo.getComputedStyle=gcs;if(!d.isIE){d._toPixelValue=function(_16e,_16f){return parseFloat(_16f)||0;};}else{d._toPixelValue=function(_170,_171){if(!_171){return 0;}if(_171=="medium"){return 4;}if(_171.slice&&_171.slice(-2)=="px"){return parseFloat(_171);}with(_170){var _172=style.left;var _173=runtimeStyle.left;runtimeStyle.left=currentStyle.left;try{style.left=_171;_171=style.pixelLeft;}catch(e){_171=0;}style.left=_172;runtimeStyle.left=_173;}return _171;};}var px=d._toPixelValue;var astr="DXImageTransform.Microsoft.Alpha";var af=function(n,f){try{return n.filters.item(astr);}catch(e){return f?{}:null;}};dojo._getOpacity=d.isIE<9?function(node){try{return af(node).Opacity/100;}catch(e){return 1;}}:function(node){return gcs(node).opacity;};dojo._setOpacity=d.isIE<9?function(node,_174){var ov=_174*100,_175=_174==1;node.style.zoom=_175?"":1;if(!af(node)){if(_175){return _174;}node.style.filter+=" progid:"+astr+"(Opacity="+ov+")";}else{af(node,1).Opacity=ov;}af(node,1).Enabled=!_175;if(node.nodeName.toLowerCase()=="tr"){d.query("> td",node).forEach(function(i){d._setOpacity(i,_174);});}return _174;}:function(node,_176){return node.style.opacity=_176;};var _177={left:true,top:true};var _178=/margin|padding|width|height|max|min|offset/;var _179=function(node,type,_17a){type=type.toLowerCase();if(d.isIE){if(_17a=="auto"){if(type=="height"){return node.offsetHeight;}if(type=="width"){return node.offsetWidth;}}if(type=="fontweight"){switch(_17a){case 700:return "bold";case 400:default:return "normal";}}}if(!(type in _177)){_177[type]=_178.test(type);}return _177[type]?px(node,_17a):_17a;};var _17b=d.isIE?"styleFloat":"cssFloat",_17c={"cssFloat":_17b,"styleFloat":_17b,"float":_17b};dojo.style=function(node,_17d,_17e){var n=byId(node),args=arguments.length,op=(_17d=="opacity");_17d=_17c[_17d]||_17d;if(args==3){return op?d._setOpacity(n,_17e):n.style[_17d]=_17e;}if(args==2&&op){return d._getOpacity(n);}var s=gcs(n);if(args==2&&typeof _17d!="string"){for(var x in _17d){d.style(node,x,_17d[x]);}return s;}return (args==1)?s:_179(n,_17d,s[_17d]||n.style[_17d]);};dojo._getPadExtents=function(n,_17f){var s=_17f||gcs(n),l=px(n,s.paddingLeft),t=px(n,s.paddingTop);return {l:l,t:t,w:l+px(n,s.paddingRight),h:t+px(n,s.paddingBottom)};};dojo._getBorderExtents=function(n,_180){var ne="none",s=_180||gcs(n),bl=(s.borderLeftStyle!=ne?px(n,s.borderLeftWidth):0),bt=(s.borderTopStyle!=ne?px(n,s.borderTopWidth):0);return {l:bl,t:bt,w:bl+(s.borderRightStyle!=ne?px(n,s.borderRightWidth):0),h:bt+(s.borderBottomStyle!=ne?px(n,s.borderBottomWidth):0)};};dojo._getPadBorderExtents=function(n,_181){var s=_181||gcs(n),p=d._getPadExtents(n,s),b=d._getBorderExtents(n,s);return {l:p.l+b.l,t:p.t+b.t,w:p.w+b.w,h:p.h+b.h};};dojo._getMarginExtents=function(n,_182){var s=_182||gcs(n),l=px(n,s.marginLeft),t=px(n,s.marginTop),r=px(n,s.marginRight),b=px(n,s.marginBottom);if(d.isWebKit&&(s.position!="absolute")){r=l;}return {l:l,t:t,w:l+r,h:t+b};};dojo._getMarginBox=function(node,_183){var s=_183||gcs(node),me=d._getMarginExtents(node,s);var l=node.offsetLeft-me.l,t=node.offsetTop-me.t,p=node.parentNode;if(d.isMoz){var sl=parseFloat(s.left),st=parseFloat(s.top);if(!isNaN(sl)&&!isNaN(st)){l=sl,t=st;}else{if(p&&p.style){var pcs=gcs(p);if(pcs.overflow!="visible"){var be=d._getBorderExtents(p,pcs);l+=be.l,t+=be.t;}}}}else{if(d.isOpera||(d.isIE>7&&!d.isQuirks)){if(p){be=d._getBorderExtents(p);l-=be.l;t-=be.t;}}}return {l:l,t:t,w:node.offsetWidth+me.w,h:node.offsetHeight+me.h};};dojo._getMarginSize=function(node,_184){node=byId(node);var me=d._getMarginExtents(node,_184||gcs(node));var size=node.getBoundingClientRect();return {w:(size.right-size.left)+me.w,h:(size.bottom-size.top)+me.h};};dojo._getContentBox=function(node,_185){var s=_185||gcs(node),pe=d._getPadExtents(node,s),be=d._getBorderExtents(node,s),w=node.clientWidth,h;if(!w){w=node.offsetWidth,h=node.offsetHeight;}else{h=node.clientHeight,be.w=be.h=0;}if(d.isOpera){pe.l+=be.l;pe.t+=be.t;}return {l:pe.l,t:pe.t,w:w-pe.w-be.w,h:h-pe.h-be.h};};dojo._getBorderBox=function(node,_186){var s=_186||gcs(node),pe=d._getPadExtents(node,s),cb=d._getContentBox(node,s);return {l:cb.l-pe.l,t:cb.t-pe.t,w:cb.w+pe.w,h:cb.h+pe.h};};dojo._setBox=function(node,l,t,w,h,u){u=u||"px";var s=node.style;if(!isNaN(l)){s.left=l+u;}if(!isNaN(t)){s.top=t+u;}if(w>=0){s.width=w+u;}if(h>=0){s.height=h+u;}};dojo._isButtonTag=function(node){return node.tagName=="BUTTON"||node.tagName=="INPUT"&&(node.getAttribute("type")||"").toUpperCase()=="BUTTON";};dojo._usesBorderBox=function(node){var n=node.tagName;return d.boxModel=="border-box"||n=="TABLE"||d._isButtonTag(node);};dojo._setContentSize=function(node,_187,_188,_189){if(d._usesBorderBox(node)){var pb=d._getPadBorderExtents(node,_189);if(_187>=0){_187+=pb.w;}if(_188>=0){_188+=pb.h;}}d._setBox(node,NaN,NaN,_187,_188);};dojo._setMarginBox=function(node,_18a,_18b,_18c,_18d,_18e){var s=_18e||gcs(node),bb=d._usesBorderBox(node),pb=bb?_18f:d._getPadBorderExtents(node,s);if(d.isWebKit){if(d._isButtonTag(node)){var ns=node.style;if(_18c>=0&&!ns.width){ns.width="4px";}if(_18d>=0&&!ns.height){ns.height="4px";}}}var mb=d._getMarginExtents(node,s);if(_18c>=0){_18c=Math.max(_18c-pb.w-mb.w,0);}if(_18d>=0){_18d=Math.max(_18d-pb.h-mb.h,0);}d._setBox(node,_18a,_18b,_18c,_18d);};var _18f={l:0,t:0,w:0,h:0};dojo.marginBox=function(node,box){var n=byId(node),s=gcs(n),b=box;return !b?d._getMarginBox(n,s):d._setMarginBox(n,b.l,b.t,b.w,b.h,s);};dojo.contentBox=function(node,box){var n=byId(node),s=gcs(n),b=box;return !b?d._getContentBox(n,s):d._setContentSize(n,b.w,b.h,s);};var _190=function(node,prop){if(!(node=(node||0).parentNode)){return 0;}var val,_191=0,_192=d.body();while(node&&node.style){if(gcs(node).position=="fixed"){return 0;}val=node[prop];if(val){_191+=val-0;if(node==_192){break;}}node=node.parentNode;}return _191;};dojo._docScroll=function(){var n=d.global;return "pageXOffset" in n?{x:n.pageXOffset,y:n.pageYOffset}:(n=d.isQuirks?d.doc.body:d.doc.documentElement,{x:d._fixIeBiDiScrollLeft(n.scrollLeft||0),y:n.scrollTop||0});};dojo._isBodyLtr=function(){return "_bodyLtr" in d?d._bodyLtr:d._bodyLtr=(d.body().dir||d.doc.documentElement.dir||"ltr").toLowerCase()=="ltr";};dojo._getIeDocumentElementOffset=function(){var de=d.doc.documentElement;if(d.isIE<8){var r=de.getBoundingClientRect();var l=r.left,t=r.top;if(d.isIE<7){l+=de.clientLeft;t+=de.clientTop;}return {x:l<0?0:l,y:t<0?0:t};}else{return {x:0,y:0};}};dojo._fixIeBiDiScrollLeft=function(_193){var ie=d.isIE;if(ie&&!d._isBodyLtr()){var qk=d.isQuirks,de=qk?d.doc.body:d.doc.documentElement;if(ie==6&&!qk&&d.global.frameElement&&de.scrollHeight>de.clientHeight){_193+=de.clientLeft;}return (ie<8||qk)?(_193+de.clientWidth-de.scrollWidth):-_193;}return _193;};dojo._abs=dojo.position=function(node,_194){node=byId(node);var db=d.body(),dh=db.parentNode,ret=node.getBoundingClientRect();ret={x:ret.left,y:ret.top,w:ret.right-ret.left,h:ret.bottom-ret.top};if(d.isIE){var _195=d._getIeDocumentElementOffset();ret.x-=_195.x+(d.isQuirks?db.clientLeft+db.offsetLeft:0);ret.y-=_195.y+(d.isQuirks?db.clientTop+db.offsetTop:0);}else{if(d.isFF==3){var cs=gcs(dh);ret.x-=px(dh,cs.marginLeft)+px(dh,cs.borderLeftWidth);ret.y-=px(dh,cs.marginTop)+px(dh,cs.borderTopWidth);}}if(_194){var _196=d._docScroll();ret.x+=_196.x;ret.y+=_196.y;}return ret;};dojo.coords=function(node,_197){var n=byId(node),s=gcs(n),mb=d._getMarginBox(n,s);var abs=d.position(n,_197);mb.x=abs.x;mb.y=abs.y;return mb;};var _198={"class":"className","for":"htmlFor",tabindex:"tabIndex",readonly:"readOnly",colspan:"colSpan",frameborder:"frameBorder",rowspan:"rowSpan",valuetype:"valueType"},_199={classname:"class",htmlfor:"for",tabindex:"tabIndex",readonly:"readOnly"},_19a={innerHTML:1,className:1,htmlFor:d.isIE,value:1};var _19b=function(name){return _199[name.toLowerCase()]||name;};var _19c=function(node,name){var attr=node.getAttributeNode&&node.getAttributeNode(name);return attr&&attr.specified;};dojo.hasAttr=function(node,name){var lc=name.toLowerCase();return _19a[_198[lc]||name]||_19c(byId(node),_199[lc]||name);};var _19d={},_19e=0,_19f=dojo._scopeName+"attrid",_1a0={col:1,colgroup:1,table:1,tbody:1,tfoot:1,thead:1,tr:1,title:1};dojo.attr=function(node,name,_1a1){node=byId(node);var args=arguments.length,prop;if(args==2&&typeof name!="string"){for(var x in name){d.attr(node,x,name[x]);}return node;}var lc=name.toLowerCase(),_1a2=_198[lc]||name,_1a3=_19a[_1a2],_1a4=_199[lc]||name;if(args==3){do{if(_1a2=="style"&&typeof _1a1!="string"){d.style(node,_1a1);break;}if(_1a2=="innerHTML"){if(d.isIE&&node.tagName.toLowerCase() in _1a0){d.empty(node);node.appendChild(d._toDom(_1a1,node.ownerDocument));}else{node[_1a2]=_1a1;}break;}if(d.isFunction(_1a1)){var _1a5=d.attr(node,_19f);if(!_1a5){_1a5=_19e++;d.attr(node,_19f,_1a5);}if(!_19d[_1a5]){_19d[_1a5]={};}var h=_19d[_1a5][_1a2];if(h){d.disconnect(h);}else{try{delete node[_1a2];}catch(e){}}_19d[_1a5][_1a2]=d.connect(node,_1a2,_1a1);break;}if(_1a3||typeof _1a1=="boolean"){node[_1a2]=_1a1;break;}node.setAttribute(_1a4,_1a1);}while(false);return node;}_1a1=node[_1a2];if(_1a3&&typeof _1a1!="undefined"){return _1a1;}if(_1a2!="href"&&(typeof _1a1=="boolean"||d.isFunction(_1a1))){return _1a1;}return _19c(node,_1a4)?node.getAttribute(_1a4):null;};dojo.removeAttr=function(node,name){byId(node).removeAttribute(_19b(name));};dojo.getNodeProp=function(node,name){node=byId(node);var lc=name.toLowerCase(),_1a6=_198[lc]||name;if((_1a6 in node)&&_1a6!="href"){return node[_1a6];}var _1a7=_199[lc]||name;return _19c(node,_1a7)?node.getAttribute(_1a7):null;};dojo.create=function(tag,_1a8,_1a9,pos){var doc=d.doc;if(_1a9){_1a9=byId(_1a9);doc=_1a9.ownerDocument;}if(typeof tag=="string"){tag=doc.createElement(tag);}if(_1a8){d.attr(tag,_1a8);}if(_1a9){d.place(tag,_1a9,pos);}return tag;};d.empty=d.isIE?function(node){node=byId(node);for(var c;c=node.lastChild;){d.destroy(c);}}:function(node){byId(node).innerHTML="";};var _1aa={option:["select"],tbody:["table"],thead:["table"],tfoot:["table"],tr:["table","tbody"],td:["table","tbody","tr"],th:["table","thead","tr"],legend:["fieldset"],caption:["table"],colgroup:["table"],col:["table","colgroup"],li:["ul"]},_1ab=/<\s*([\w\:]+)/,_1ac={},_1ad=0,_1ae="__"+d._scopeName+"ToDomId";for(var _1af in _1aa){if(_1aa.hasOwnProperty(_1af)){var tw=_1aa[_1af];tw.pre=_1af=="option"?"<select multiple=\"multiple\">":"<"+tw.join("><")+">";tw.post="</"+tw.reverse().join("></")+">";}}d._toDom=function(frag,doc){doc=doc||d.doc;var _1b0=doc[_1ae];if(!_1b0){doc[_1ae]=_1b0=++_1ad+"";_1ac[_1b0]=doc.createElement("div");}frag+="";var _1b1=frag.match(_1ab),tag=_1b1?_1b1[1].toLowerCase():"",_1b2=_1ac[_1b0],wrap,i,fc,df;if(_1b1&&_1aa[tag]){wrap=_1aa[tag];_1b2.innerHTML=wrap.pre+frag+wrap.post;for(i=wrap.length;i;--i){_1b2=_1b2.firstChild;}}else{_1b2.innerHTML=frag;}if(_1b2.childNodes.length==1){return _1b2.removeChild(_1b2.firstChild);}df=doc.createDocumentFragment();while(fc=_1b2.firstChild){df.appendChild(fc);}return df;};var _1b3="className";dojo.hasClass=function(node,_1b4){return ((" "+byId(node)[_1b3]+" ").indexOf(" "+_1b4+" ")>=0);};var _1b5=/\s+/,a1=[""],_1b6={},_1b7=function(s){if(typeof s=="string"||s instanceof String){if(s.indexOf(" ")<0){a1[0]=s;return a1;}else{return s.split(_1b5);}}return s||"";};dojo.addClass=function(node,_1b8){node=byId(node);_1b8=_1b7(_1b8);var cls=node[_1b3],_1b9;cls=cls?" "+cls+" ":" ";_1b9=cls.length;for(var i=0,len=_1b8.length,c;i<len;++i){c=_1b8[i];if(c&&cls.indexOf(" "+c+" ")<0){cls+=c+" ";}}if(_1b9<cls.length){node[_1b3]=cls.substr(1,cls.length-2);}};dojo.removeClass=function(node,_1ba){node=byId(node);var cls;if(_1ba!==undefined){_1ba=_1b7(_1ba);cls=" "+node[_1b3]+" ";for(var i=0,len=_1ba.length;i<len;++i){cls=cls.replace(" "+_1ba[i]+" "," ");}cls=d.trim(cls);}else{cls="";}if(node[_1b3]!=cls){node[_1b3]=cls;}};dojo.replaceClass=function(node,_1bb,_1bc){node=byId(node);_1b6.className=node.className;dojo.removeClass(_1b6,_1bc);dojo.addClass(_1b6,_1bb);if(node.className!==_1b6.className){node.className=_1b6.className;}};dojo.toggleClass=function(node,_1bd,_1be){if(_1be===undefined){_1be=!d.hasClass(node,_1bd);}d[_1be?"addClass":"removeClass"](node,_1bd);};})();}if(!dojo._hasResource["dojo._base.NodeList"]){dojo._hasResource["dojo._base.NodeList"]=true;dojo.provide("dojo._base.NodeList");(function(){var d=dojo;var ap=Array.prototype,aps=ap.slice,apc=ap.concat;var tnl=function(a,_1bf,_1c0){if(!a.sort){a=aps.call(a,0);}var ctor=_1c0||this._NodeListCtor||d._NodeListCtor;a.constructor=ctor;dojo._mixin(a,ctor.prototype);a._NodeListCtor=ctor;return _1bf?a._stash(_1bf):a;};var _1c1=function(f,a,o){a=[0].concat(aps.call(a,0));o=o||d.global;return function(node){a[0]=node;return f.apply(o,a);};};var _1c2=function(f,o){return function(){this.forEach(_1c1(f,arguments,o));return this;};};var _1c3=function(f,o){return function(){return this.map(_1c1(f,arguments,o));};};var _1c4=function(f,o){return function(){return this.filter(_1c1(f,arguments,o));};};var _1c5=function(f,g,o){return function(){var a=arguments,body=_1c1(f,a,o);if(g.call(o||d.global,a)){return this.map(body);}this.forEach(body);return this;};};var _1c6=function(a){return a.length==1&&(typeof a[0]=="string");};var _1c7=function(node){var p=node.parentNode;if(p){p.removeChild(node);}};dojo.NodeList=function(){return tnl(Array.apply(null,arguments));};d._NodeListCtor=d.NodeList;var nl=d.NodeList,nlp=nl.prototype;nl._wrap=nlp._wrap=tnl;nl._adaptAsMap=_1c3;nl._adaptAsForEach=_1c2;nl._adaptAsFilter=_1c4;nl._adaptWithCondition=_1c5;d.forEach(["slice","splice"],function(name){var f=ap[name];nlp[name]=function(){return this._wrap(f.apply(this,arguments),name=="slice"?this:null);};});d.forEach(["indexOf","lastIndexOf","every","some"],function(name){var f=d[name];nlp[name]=function(){return f.apply(d,[this].concat(aps.call(arguments,0)));};});d.forEach(["attr","style"],function(name){nlp[name]=_1c5(d[name],_1c6);});d.forEach(["connect","addClass","removeClass","replaceClass","toggleClass","empty","removeAttr"],function(name){nlp[name]=_1c2(d[name]);});dojo.extend(dojo.NodeList,{_normalize:function(_1c8,_1c9){var _1ca=_1c8.parse===true?true:false;if(typeof _1c8.template=="string"){var _1cb=_1c8.templateFunc||(dojo.string&&dojo.string.substitute);_1c8=_1cb?_1cb(_1c8.template,_1c8):_1c8;}var type=(typeof _1c8);if(type=="string"||type=="number"){_1c8=dojo._toDom(_1c8,(_1c9&&_1c9.ownerDocument));if(_1c8.nodeType==11){_1c8=dojo._toArray(_1c8.childNodes);}else{_1c8=[_1c8];}}else{if(!dojo.isArrayLike(_1c8)){_1c8=[_1c8];}else{if(!dojo.isArray(_1c8)){_1c8=dojo._toArray(_1c8);}}}if(_1ca){_1c8._runParse=true;}return _1c8;},_cloneNode:function(node){return node.cloneNode(true);},_place:function(ary,_1cc,_1cd,_1ce){if(_1cc.nodeType!=1&&_1cd=="only"){return;}var _1cf=_1cc,_1d0;var _1d1=ary.length;for(var i=_1d1-1;i>=0;i--){var node=(_1ce?this._cloneNode(ary[i]):ary[i]);if(ary._runParse&&dojo.parser&&dojo.parser.parse){if(!_1d0){_1d0=_1cf.ownerDocument.createElement("div");}_1d0.appendChild(node);dojo.parser.parse(_1d0);node=_1d0.firstChild;while(_1d0.firstChild){_1d0.removeChild(_1d0.firstChild);}}if(i==_1d1-1){dojo.place(node,_1cf,_1cd);}else{_1cf.parentNode.insertBefore(node,_1cf);}_1cf=node;}},_stash:function(_1d2){this._parent=_1d2;return this;},end:function(){if(this._parent){return this._parent;}else{return new this._NodeListCtor();}},concat:function(item){var t=d.isArray(this)?this:aps.call(this,0),m=d.map(arguments,function(a){return a&&!d.isArray(a)&&(typeof NodeList!="undefined"&&a.constructor===NodeList||a.constructor===this._NodeListCtor)?aps.call(a,0):a;});return this._wrap(apc.apply(t,m),this);},map:function(func,obj){return this._wrap(d.map(this,func,obj),this);},forEach:function(_1d3,_1d4){d.forEach(this,_1d3,_1d4);return this;},coords:_1c3(d.coords),position:_1c3(d.position),place:function(_1d5,_1d6){var item=d.query(_1d5)[0];return this.forEach(function(node){d.place(node,item,_1d6);});},orphan:function(_1d7){return (_1d7?d._filterQueryResult(this,_1d7):this).forEach(_1c7);},adopt:function(_1d8,_1d9){return d.query(_1d8).place(this[0],_1d9)._stash(this);},query:function(_1da){if(!_1da){return this;}var ret=this.map(function(node){return d.query(_1da,node).filter(function(_1db){return _1db!==undefined;});});return this._wrap(apc.apply([],ret),this);},filter:function(_1dc){var a=arguments,_1dd=this,_1de=0;if(typeof _1dc=="string"){_1dd=d._filterQueryResult(this,a[0]);if(a.length==1){return _1dd._stash(this);}_1de=1;}return this._wrap(d.filter(_1dd,a[_1de],a[_1de+1]),this);},addContent:function(_1df,_1e0){_1df=this._normalize(_1df,this[0]);for(var i=0,node;(node=this[i]);i++){this._place(_1df,node,_1e0,i>0);}return this;},instantiate:function(_1e1,_1e2){var c=d.isFunction(_1e1)?_1e1:d.getObject(_1e1);_1e2=_1e2||{};return this.forEach(function(node){new c(_1e2,node);});},at:function(){var t=new this._NodeListCtor();d.forEach(arguments,function(i){if(i<0){i=this.length+i;}if(this[i]){t.push(this[i]);}},this);return t._stash(this);}});nl.events=["blur","focus","change","click","error","keydown","keypress","keyup","load","mousedown","mouseenter","mouseleave","mousemove","mouseout","mouseover","mouseup","submit"];d.forEach(nl.events,function(evt){var _1e3="on"+evt;nlp[_1e3]=function(a,b){return this.connect(_1e3,a,b);};});})();}if(!dojo._hasResource["dojo._base.query"]){dojo._hasResource["dojo._base.query"]=true;(function(){var _1e4=function(d){var trim=d.trim;var each=d.forEach;var qlc=(d._NodeListCtor=d.NodeList);var _1e5=function(){return d.doc;};var _1e6=((d.isWebKit||d.isMozilla)&&((_1e5().compatMode)=="BackCompat"));var _1e7=!!_1e5().firstChild["children"]?"children":"childNodes";var _1e8=">~+";var _1e9=false;var _1ea=function(){return true;};var _1eb=function(_1ec){if(_1e8.indexOf(_1ec.slice(-1))>=0){_1ec+=" * ";}else{_1ec+=" ";}var ts=function(s,e){return trim(_1ec.slice(s,e));};var _1ed=[];var _1ee=-1,_1ef=-1,_1f0=-1,_1f1=-1,_1f2=-1,inId=-1,_1f3=-1,lc="",cc="",_1f4;var x=0,ql=_1ec.length,_1f5=null,_1f6=null;var _1f7=function(){if(_1f3>=0){var tv=(_1f3==x)?null:ts(_1f3,x);_1f5[(_1e8.indexOf(tv)<0)?"tag":"oper"]=tv;_1f3=-1;}};var _1f8=function(){if(inId>=0){_1f5.id=ts(inId,x).replace(/\\/g,"");inId=-1;}};var _1f9=function(){if(_1f2>=0){_1f5.classes.push(ts(_1f2+1,x).replace(/\\/g,""));_1f2=-1;}};var _1fa=function(){_1f8();_1f7();_1f9();};var _1fb=function(){_1fa();if(_1f1>=0){_1f5.pseudos.push({name:ts(_1f1+1,x)});}_1f5.loops=(_1f5.pseudos.length||_1f5.attrs.length||_1f5.classes.length);_1f5.oquery=_1f5.query=ts(_1f4,x);_1f5.otag=_1f5.tag=(_1f5["oper"])?null:(_1f5.tag||"*");if(_1f5.tag){_1f5.tag=_1f5.tag.toUpperCase();}if(_1ed.length&&(_1ed[_1ed.length-1].oper)){_1f5.infixOper=_1ed.pop();_1f5.query=_1f5.infixOper.query+" "+_1f5.query;}_1ed.push(_1f5);_1f5=null;};for(;lc=cc,cc=_1ec.charAt(x),x<ql;x++){if(lc=="\\"){continue;}if(!_1f5){_1f4=x;_1f5={query:null,pseudos:[],attrs:[],classes:[],tag:null,oper:null,id:null,getTag:function(){return (_1e9)?this.otag:this.tag;}};_1f3=x;}if(_1ee>=0){if(cc=="]"){if(!_1f6.attr){_1f6.attr=ts(_1ee+1,x);}else{_1f6.matchFor=ts((_1f0||_1ee+1),x);}var cmf=_1f6.matchFor;if(cmf){if((cmf.charAt(0)=="\"")||(cmf.charAt(0)=="'")){_1f6.matchFor=cmf.slice(1,-1);}}_1f5.attrs.push(_1f6);_1f6=null;_1ee=_1f0=-1;}else{if(cc=="="){var _1fc=("|~^$*".indexOf(lc)>=0)?lc:"";_1f6.type=_1fc+cc;_1f6.attr=ts(_1ee+1,x-_1fc.length);_1f0=x+1;}}}else{if(_1ef>=0){if(cc==")"){if(_1f1>=0){_1f6.value=ts(_1ef+1,x);}_1f1=_1ef=-1;}}else{if(cc=="#"){_1fa();inId=x+1;}else{if(cc=="."){_1fa();_1f2=x;}else{if(cc==":"){_1fa();_1f1=x;}else{if(cc=="["){_1fa();_1ee=x;_1f6={};}else{if(cc=="("){if(_1f1>=0){_1f6={name:ts(_1f1+1,x),value:null};_1f5.pseudos.push(_1f6);}_1ef=x;}else{if((cc==" ")&&(lc!=cc)){_1fb();}}}}}}}}}return _1ed;};var _1fd=function(_1fe,_1ff){if(!_1fe){return _1ff;}if(!_1ff){return _1fe;}return function(){return _1fe.apply(window,arguments)&&_1ff.apply(window,arguments);};};var _200=function(i,arr){var r=arr||[];if(i){r.push(i);}return r;};var _201=function(n){return (1==n.nodeType);};var _202="";var _203=function(elem,attr){if(!elem){return _202;}if(attr=="class"){return elem.className||_202;}if(attr=="for"){return elem.htmlFor||_202;}if(attr=="style"){return elem.style.cssText||_202;}return (_1e9?elem.getAttribute(attr):elem.getAttribute(attr,2))||_202;};var _204={"*=":function(attr,_205){return function(elem){return (_203(elem,attr).indexOf(_205)>=0);};},"^=":function(attr,_206){return function(elem){return (_203(elem,attr).indexOf(_206)==0);};},"$=":function(attr,_207){var tval=" "+_207;return function(elem){var ea=" "+_203(elem,attr);return (ea.lastIndexOf(_207)==(ea.length-_207.length));};},"~=":function(attr,_208){var tval=" "+_208+" ";return function(elem){var ea=" "+_203(elem,attr)+" ";return (ea.indexOf(tval)>=0);};},"|=":function(attr,_209){var _20a=" "+_209+"-";return function(elem){var ea=" "+_203(elem,attr);return ((ea==_209)||(ea.indexOf(_20a)==0));};},"=":function(attr,_20b){return function(elem){return (_203(elem,attr)==_20b);};}};var _20c=(typeof _1e5().firstChild.nextElementSibling=="undefined");var _20d=!_20c?"nextElementSibling":"nextSibling";var _20e=!_20c?"previousElementSibling":"previousSibling";var _20f=(_20c?_201:_1ea);var _210=function(node){while(node=node[_20e]){if(_20f(node)){return false;}}return true;};var _211=function(node){while(node=node[_20d]){if(_20f(node)){return false;}}return true;};var _212=function(node){var root=node.parentNode;var i=0,tret=root[_1e7],ci=(node["_i"]||-1),cl=(root["_l"]||-1);if(!tret){return -1;}var l=tret.length;if(cl==l&&ci>=0&&cl>=0){return ci;}root["_l"]=l;ci=-1;for(var te=root["firstElementChild"]||root["firstChild"];te;te=te[_20d]){if(_20f(te)){te["_i"]=++i;if(node===te){ci=i;}}}return ci;};var _213=function(elem){return !((_212(elem))%2);};var _214=function(elem){return ((_212(elem))%2);};var _215={"checked":function(name,_216){return function(elem){return !!("checked" in elem?elem.checked:elem.selected);};},"first-child":function(){return _210;},"last-child":function(){return _211;},"only-child":function(name,_217){return function(node){if(!_210(node)){return false;}if(!_211(node)){return false;}return true;};},"empty":function(name,_218){return function(elem){var cn=elem.childNodes;var cnl=elem.childNodes.length;for(var x=cnl-1;x>=0;x--){var nt=cn[x].nodeType;if((nt===1)||(nt==3)){return false;}}return true;};},"contains":function(name,_219){var cz=_219.charAt(0);if(cz=="\""||cz=="'"){_219=_219.slice(1,-1);}return function(elem){return (elem.innerHTML.indexOf(_219)>=0);};},"not":function(name,_21a){var p=_1eb(_21a)[0];var _21b={el:1};if(p.tag!="*"){_21b.tag=1;}if(!p.classes.length){_21b.classes=1;}var ntf=_21c(p,_21b);return function(elem){return (!ntf(elem));};},"nth-child":function(name,_21d){var pi=parseInt;if(_21d=="odd"){return _214;}else{if(_21d=="even"){return _213;}}if(_21d.indexOf("n")!=-1){var _21e=_21d.split("n",2);var pred=_21e[0]?((_21e[0]=="-")?-1:pi(_21e[0])):1;var idx=_21e[1]?pi(_21e[1]):0;var lb=0,ub=-1;if(pred>0){if(idx<0){idx=(idx%pred)&&(pred+(idx%pred));}else{if(idx>0){if(idx>=pred){lb=idx-idx%pred;}idx=idx%pred;}}}else{if(pred<0){pred*=-1;if(idx>0){ub=idx;idx=idx%pred;}}}if(pred>0){return function(elem){var i=_212(elem);return (i>=lb)&&(ub<0||i<=ub)&&((i%pred)==idx);};}else{_21d=idx;}}var _21f=pi(_21d);return function(elem){return (_212(elem)==_21f);};}};var _220=(d.isIE<9||(dojo.isIE&&dojo.isQuirks))?function(cond){var clc=cond.toLowerCase();if(clc=="class"){cond="className";}return function(elem){return (_1e9?elem.getAttribute(cond):elem[cond]||elem[clc]);};}:function(cond){return function(elem){return (elem&&elem.getAttribute&&elem.hasAttribute(cond));};};var _21c=function(_221,_222){if(!_221){return _1ea;}_222=_222||{};var ff=null;if(!("el" in _222)){ff=_1fd(ff,_201);}if(!("tag" in _222)){if(_221.tag!="*"){ff=_1fd(ff,function(elem){return (elem&&(elem.tagName==_221.getTag()));});}}if(!("classes" in _222)){each(_221.classes,function(_223,idx,arr){var re=new RegExp("(?:^|\\s)"+_223+"(?:\\s|$)");ff=_1fd(ff,function(elem){return re.test(elem.className);});ff.count=idx;});}if(!("pseudos" in _222)){each(_221.pseudos,function(_224){var pn=_224.name;if(_215[pn]){ff=_1fd(ff,_215[pn](pn,_224.value));}});}if(!("attrs" in _222)){each(_221.attrs,function(attr){var _225;var a=attr.attr;if(attr.type&&_204[attr.type]){_225=_204[attr.type](a,attr.matchFor);}else{if(a.length){_225=_220(a);}}if(_225){ff=_1fd(ff,_225);}});}if(!("id" in _222)){if(_221.id){ff=_1fd(ff,function(elem){return (!!elem&&(elem.id==_221.id));});}}if(!ff){if(!("default" in _222)){ff=_1ea;}}return ff;};var _226=function(_227){return function(node,ret,bag){while(node=node[_20d]){if(_20c&&(!_201(node))){continue;}if((!bag||_228(node,bag))&&_227(node)){ret.push(node);}break;}return ret;};};var _229=function(_22a){return function(root,ret,bag){var te=root[_20d];while(te){if(_20f(te)){if(bag&&!_228(te,bag)){break;}if(_22a(te)){ret.push(te);}}te=te[_20d];}return ret;};};var _22b=function(_22c){_22c=_22c||_1ea;return function(root,ret,bag){var te,x=0,tret=root[_1e7];while(te=tret[x++]){if(_20f(te)&&(!bag||_228(te,bag))&&(_22c(te,x))){ret.push(te);}}return ret;};};var _22d=function(node,root){var pn=node.parentNode;while(pn){if(pn==root){break;}pn=pn.parentNode;}return !!pn;};var _22e={};var _22f=function(_230){var _231=_22e[_230.query];if(_231){return _231;}var io=_230.infixOper;var oper=(io?io.oper:"");var _232=_21c(_230,{el:1});var qt=_230.tag;var _233=("*"==qt);var ecs=_1e5()["getElementsByClassName"];if(!oper){if(_230.id){_232=(!_230.loops&&_233)?_1ea:_21c(_230,{el:1,id:1});_231=function(root,arr){var te=d.byId(_230.id,(root.ownerDocument||root));if(!te||!_232(te)){return;}if(9==root.nodeType){return _200(te,arr);}else{if(_22d(te,root)){return _200(te,arr);}}};}else{if(ecs&&/\{\s*\[native code\]\s*\}/.test(String(ecs))&&_230.classes.length&&!_1e6){_232=_21c(_230,{el:1,classes:1,id:1});var _234=_230.classes.join(" ");_231=function(root,arr,bag){var ret=_200(0,arr),te,x=0;var tret=root.getElementsByClassName(_234);while((te=tret[x++])){if(_232(te,root)&&_228(te,bag)){ret.push(te);}}return ret;};}else{if(!_233&&!_230.loops){_231=function(root,arr,bag){var ret=_200(0,arr),te,x=0;var tret=root.getElementsByTagName(_230.getTag());while((te=tret[x++])){if(_228(te,bag)){ret.push(te);}}return ret;};}else{_232=_21c(_230,{el:1,tag:1,id:1});_231=function(root,arr,bag){var ret=_200(0,arr),te,x=0;var tret=root.getElementsByTagName(_230.getTag());while((te=tret[x++])){if(_232(te,root)&&_228(te,bag)){ret.push(te);}}return ret;};}}}}else{var _235={el:1};if(_233){_235.tag=1;}_232=_21c(_230,_235);if("+"==oper){_231=_226(_232);}else{if("~"==oper){_231=_229(_232);}else{if(">"==oper){_231=_22b(_232);}}}}return _22e[_230.query]=_231;};var _236=function(root,_237){var _238=_200(root),qp,x,te,qpl=_237.length,bag,ret;for(var i=0;i<qpl;i++){ret=[];qp=_237[i];x=_238.length-1;if(x>0){bag={};ret.nozip=true;}var gef=_22f(qp);for(var j=0;(te=_238[j]);j++){gef(te,ret,bag);}if(!ret.length){break;}_238=ret;}return ret;};var _239={},_23a={};var _23b=function(_23c){var _23d=_1eb(trim(_23c));if(_23d.length==1){var tef=_22f(_23d[0]);return function(root){var r=tef(root,new qlc());if(r){r.nozip=true;}return r;};}return function(root){return _236(root,_23d);};};var nua=navigator.userAgent;var wk="WebKit/";var _23e=(d.isWebKit&&(nua.indexOf(wk)>0)&&(parseFloat(nua.split(wk)[1])>528));var _23f=d.isIE?"commentStrip":"nozip";var qsa="querySelectorAll";var _240=(!!_1e5()[qsa]&&(!d.isSafari||(d.isSafari>3.1)||_23e));var _241=/n\+\d|([^ ])?([>~+])([^ =])?/g;var _242=function(_243,pre,ch,post){return ch?(pre?pre+" ":"")+ch+(post?" "+post:""):_243;};var _244=function(_245,_246){_245=_245.replace(_241,_242);if(_240){var _247=_23a[_245];if(_247&&!_246){return _247;}}var _248=_239[_245];if(_248){return _248;}var qcz=_245.charAt(0);var _249=(-1==_245.indexOf(" "));if((_245.indexOf("#")>=0)&&(_249)){_246=true;}var _24a=(_240&&(!_246)&&(_1e8.indexOf(qcz)==-1)&&(!d.isIE||(_245.indexOf(":")==-1))&&(!(_1e6&&(_245.indexOf(".")>=0)))&&(_245.indexOf(":contains")==-1)&&(_245.indexOf(":checked")==-1)&&(_245.indexOf("|=")==-1));if(_24a){var tq=(_1e8.indexOf(_245.charAt(_245.length-1))>=0)?(_245+" *"):_245;return _23a[_245]=function(root){try{if(!((9==root.nodeType)||_249)){throw "";}var r=root[qsa](tq);r[_23f]=true;return r;}catch(e){return _244(_245,true)(root);}};}else{var _24b=_245.split(/\s*,\s*/);return _239[_245]=((_24b.length<2)?_23b(_245):function(root){var _24c=0,ret=[],tp;while((tp=_24b[_24c++])){ret=ret.concat(_23b(tp)(root));}return ret;});}};var _24d=0;var _24e=d.isIE?function(node){if(_1e9){return (node.getAttribute("_uid")||node.setAttribute("_uid",++_24d)||_24d);}else{return node.uniqueID;}}:function(node){return (node._uid||(node._uid=++_24d));};var _228=function(node,bag){if(!bag){return 1;}var id=_24e(node);if(!bag[id]){return bag[id]=1;}return 0;};var _24f="_zipIdx";var _250=function(arr){if(arr&&arr.nozip){return (qlc._wrap)?qlc._wrap(arr):arr;}var ret=new qlc();if(!arr||!arr.length){return ret;}if(arr[0]){ret.push(arr[0]);}if(arr.length<2){return ret;}_24d++;if(d.isIE&&_1e9){var _251=_24d+"";arr[0].setAttribute(_24f,_251);for(var x=1,te;te=arr[x];x++){if(arr[x].getAttribute(_24f)!=_251){ret.push(te);}te.setAttribute(_24f,_251);}}else{if(d.isIE&&arr.commentStrip){try{for(var x=1,te;te=arr[x];x++){if(_201(te)){ret.push(te);}}}catch(e){}}else{if(arr[0]){arr[0][_24f]=_24d;}for(var x=1,te;te=arr[x];x++){if(arr[x][_24f]!=_24d){ret.push(te);}te[_24f]=_24d;}}}return ret;};d.query=function(_252,root){qlc=d._NodeListCtor;if(!_252){return new qlc();}if(_252.constructor==qlc){return _252;}if(typeof _252!="string"){return new qlc(_252);}if(typeof root=="string"){root=d.byId(root);if(!root){return new qlc();}}root=root||_1e5();var od=root.ownerDocument||root.documentElement;_1e9=(root.contentType&&root.contentType=="application/xml")||(d.isOpera&&(root.doctype||od.toString()=="[object XMLDocument]"))||(!!od)&&(d.isIE?od.xml:(root.xmlVersion||od.xmlVersion));var r=_244(_252)(root);if(r&&r.nozip&&!qlc._wrap){return r;}return _250(r);};d.query.pseudos=_215;d._filterQueryResult=function(_253,_254,root){var _255=new d._NodeListCtor(),_256=_1eb(_254),_257=(_256.length==1&&!/[^\w#\.]/.test(_254))?_21c(_256[0]):function(node){return dojo.query(_254,root).indexOf(node)!=-1;};for(var x=0,te;te=_253[x];x++){if(_257(te)){_255.push(te);}}return _255;};};var _258=function(){acme={trim:function(str){str=str.replace(/^\s+/,"");for(var i=str.length-1;i>=0;i--){if(/\S/.test(str.charAt(i))){str=str.substring(0,i+1);break;}}return str;},forEach:function(arr,_259,_25a){if(!arr||!arr.length){return;}for(var i=0,l=arr.length;i<l;++i){_259.call(_25a||window,arr[i],i,arr);}},byId:function(id,doc){if(typeof id=="string"){return (doc||document).getElementById(id);}else{return id;}},doc:document,NodeList:Array};var n=navigator;var dua=n.userAgent;var dav=n.appVersion;var tv=parseFloat(dav);acme.isOpera=(dua.indexOf("Opera")>=0)?tv:undefined;acme.isKhtml=(dav.indexOf("Konqueror")>=0)?tv:undefined;acme.isWebKit=parseFloat(dua.split("WebKit/")[1])||undefined;acme.isChrome=parseFloat(dua.split("Chrome/")[1])||undefined;var _25b=Math.max(dav.indexOf("WebKit"),dav.indexOf("Safari"),0);if(_25b&&!acme.isChrome){acme.isSafari=parseFloat(dav.split("Version/")[1]);if(!acme.isSafari||parseFloat(dav.substr(_25b+7))<=419.3){acme.isSafari=2;}}if(document.all&&!acme.isOpera){acme.isIE=parseFloat(dav.split("MSIE ")[1])||undefined;}Array._wrap=function(arr){return arr;};return acme;};if(dojo){dojo.provide("dojo._base.query");_1e4(this["queryPortability"]||this["acme"]||dojo);}else{_1e4(this["queryPortability"]||this["acme"]||_258());}})();}if(!dojo._hasResource["dojo._base.xhr"]){dojo._hasResource["dojo._base.xhr"]=true;dojo.provide("dojo._base.xhr");(function(){var _25c=dojo,cfg=_25c.config;function _25d(obj,name,_25e){if(_25e===null){return;}var val=obj[name];if(typeof val=="string"){obj[name]=[val,_25e];}else{if(_25c.isArray(val)){val.push(_25e);}else{obj[name]=_25e;}}};dojo.fieldToObject=function(_25f){var ret=null;var item=_25c.byId(_25f);if(item){var _260=item.name;var type=(item.type||"").toLowerCase();if(_260&&type&&!item.disabled){if(type=="radio"||type=="checkbox"){if(item.checked){ret=item.value;}}else{if(item.multiple){ret=[];_25c.query("option",item).forEach(function(opt){if(opt.selected){ret.push(opt.value);}});}else{ret=item.value;}}}}return ret;};dojo.formToObject=function(_261){var ret={};var _262="file|submit|image|reset|button|";_25c.forEach(dojo.byId(_261).elements,function(item){var _263=item.name;var type=(item.type||"").toLowerCase();if(_263&&type&&_262.indexOf(type)==-1&&!item.disabled){_25d(ret,_263,_25c.fieldToObject(item));if(type=="image"){ret[_263+".x"]=ret[_263+".y"]=ret[_263].x=ret[_263].y=0;}}});return ret;};dojo.objectToQuery=function(map){var enc=encodeURIComponent;var _264=[];var _265={};for(var name in map){var _266=map[name];if(_266!=_265[name]){var _267=enc(name)+"=";if(_25c.isArray(_266)){for(var i=0;i<_266.length;i++){_264.push(_267+enc(_266[i]));}}else{_264.push(_267+enc(_266));}}}return _264.join("&");};dojo.formToQuery=function(_268){return _25c.objectToQuery(_25c.formToObject(_268));};dojo.formToJson=function(_269,_26a){return _25c.toJson(_25c.formToObject(_269),_26a);};dojo.queryToObject=function(str){var ret={};var qp=str.split("&");var dec=decodeURIComponent;_25c.forEach(qp,function(item){if(item.length){var _26b=item.split("=");var name=dec(_26b.shift());var val=dec(_26b.join("="));if(typeof ret[name]=="string"){ret[name]=[ret[name]];}if(_25c.isArray(ret[name])){ret[name].push(val);}else{ret[name]=val;}}});return ret;};dojo._blockAsync=false;var _26c=_25c._contentHandlers=dojo.contentHandlers={text:function(xhr){return xhr.responseText;},json:function(xhr){return _25c.fromJson(xhr.responseText||null);},"json-comment-filtered":function(xhr){if(!dojo.config.useCommentedJson){console.warn("Consider using the standard mimetype:application/json."+" json-commenting can introduce security issues. To"+" decrease the chances of hijacking, use the standard the 'json' handler and"+" prefix your json with: {}&&\n"+"Use djConfig.useCommentedJson=true to turn off this message.");}var _26d=xhr.responseText;var _26e=_26d.indexOf("/*");var _26f=_26d.lastIndexOf("*/");if(_26e==-1||_26f==-1){throw new Error("JSON was not comment filtered");}return _25c.fromJson(_26d.substring(_26e+2,_26f));},javascript:function(xhr){return _25c.eval(xhr.responseText);},xml:function(xhr){var _270=xhr.responseXML;if(_25c.isIE&&(!_270||!_270.documentElement)){var ms=function(n){return "MSXML"+n+".DOMDocument";};var dp=["Microsoft.XMLDOM",ms(6),ms(4),ms(3),ms(2)];_25c.some(dp,function(p){try{var dom=new ActiveXObject(p);dom.async=false;dom.loadXML(xhr.responseText);_270=dom;}catch(e){return false;}return true;});}return _270;},"json-comment-optional":function(xhr){if(xhr.responseText&&/^[^{\[]*\/\*/.test(xhr.responseText)){return _26c["json-comment-filtered"](xhr);}else{return _26c["json"](xhr);}}};dojo._ioSetArgs=function(args,_271,_272,_273){var _274={args:args,url:args.url};var _275=null;if(args.form){var form=_25c.byId(args.form);var _276=form.getAttributeNode("action");_274.url=_274.url||(_276?_276.value:null);_275=_25c.formToObject(form);}var _277=[{}];if(_275){_277.push(_275);}if(args.content){_277.push(args.content);}if(args.preventCache){_277.push({"dojo.preventCache":new Date().valueOf()});}_274.query=_25c.objectToQuery(_25c.mixin.apply(null,_277));_274.handleAs=args.handleAs||"text";var d=new _25c.Deferred(_271);d.addCallbacks(_272,function(_278){return _273(_278,d);});var ld=args.load;if(ld&&_25c.isFunction(ld)){d.addCallback(function(_279){return ld.call(args,_279,_274);});}var err=args.error;if(err&&_25c.isFunction(err)){d.addErrback(function(_27a){return err.call(args,_27a,_274);});}var _27b=args.handle;if(_27b&&_25c.isFunction(_27b)){d.addBoth(function(_27c){return _27b.call(args,_27c,_274);});}if(cfg.ioPublish&&_25c.publish&&_274.args.ioPublish!==false){d.addCallbacks(function(res){_25c.publish("/dojo/io/load",[d,res]);return res;},function(res){_25c.publish("/dojo/io/error",[d,res]);return res;});d.addBoth(function(res){_25c.publish("/dojo/io/done",[d,res]);return res;});}d.ioArgs=_274;return d;};var _27d=function(dfd){dfd.canceled=true;var xhr=dfd.ioArgs.xhr;var _27e=typeof xhr.abort;if(_27e=="function"||_27e=="object"||_27e=="unknown"){xhr.abort();}var err=dfd.ioArgs.error;if(!err){err=new Error("xhr cancelled");err.dojoType="cancel";}return err;};var _27f=function(dfd){var ret=_26c[dfd.ioArgs.handleAs](dfd.ioArgs.xhr);return ret===undefined?null:ret;};var _280=function(_281,dfd){if(!dfd.ioArgs.args.failOk){console.error(_281);}return _281;};var _282=null;var _283=[];var _284=0;var _285=function(dfd){if(_284<=0){_284=0;if(cfg.ioPublish&&_25c.publish&&(!dfd||dfd&&dfd.ioArgs.args.ioPublish!==false)){_25c.publish("/dojo/io/stop");}}};var _286=function(){var now=(new Date()).getTime();if(!_25c._blockAsync){for(var i=0,tif;i<_283.length&&(tif=_283[i]);i++){var dfd=tif.dfd;var func=function(){if(!dfd||dfd.canceled||!tif.validCheck(dfd)){_283.splice(i--,1);_284-=1;}else{if(tif.ioCheck(dfd)){_283.splice(i--,1);tif.resHandle(dfd);_284-=1;}else{if(dfd.startTime){if(dfd.startTime+(dfd.ioArgs.args.timeout||0)<now){_283.splice(i--,1);var err=new Error("timeout exceeded");err.dojoType="timeout";dfd.errback(err);dfd.cancel();_284-=1;}}}}};if(dojo.config.debugAtAllCosts){func.call(this);}else{try{func.call(this);}catch(e){dfd.errback(e);}}}}_285(dfd);if(!_283.length){clearInterval(_282);_282=null;return;}};dojo._ioCancelAll=function(){try{_25c.forEach(_283,function(i){try{i.dfd.cancel();}catch(e){}});}catch(e){}};if(_25c.isIE){_25c.addOnWindowUnload(_25c._ioCancelAll);}_25c._ioNotifyStart=function(dfd){if(cfg.ioPublish&&_25c.publish&&dfd.ioArgs.args.ioPublish!==false){if(!_284){_25c.publish("/dojo/io/start");}_284+=1;_25c.publish("/dojo/io/send",[dfd]);}};_25c._ioWatch=function(dfd,_287,_288,_289){var args=dfd.ioArgs.args;if(args.timeout){dfd.startTime=(new Date()).getTime();}_283.push({dfd:dfd,validCheck:_287,ioCheck:_288,resHandle:_289});if(!_282){_282=setInterval(_286,50);}if(args.sync){_286();}};var _28a="application/x-www-form-urlencoded";var _28b=function(dfd){return dfd.ioArgs.xhr.readyState;};var _28c=function(dfd){return 4==dfd.ioArgs.xhr.readyState;};var _28d=function(dfd){var xhr=dfd.ioArgs.xhr;if(_25c._isDocumentOk(xhr)){dfd.callback(dfd);}else{var err=new Error("Unable to load "+dfd.ioArgs.url+" status:"+xhr.status);err.status=xhr.status;err.responseText=xhr.responseText;dfd.errback(err);}};dojo._ioAddQueryToUrl=function(_28e){if(_28e.query.length){_28e.url+=(_28e.url.indexOf("?")==-1?"?":"&")+_28e.query;_28e.query=null;}};dojo.xhr=function(_28f,args,_290){var dfd=_25c._ioSetArgs(args,_27d,_27f,_280);var _291=dfd.ioArgs;var xhr=_291.xhr=_25c._xhrObj(_291.args);if(!xhr){dfd.cancel();return dfd;}if("postData" in args){_291.query=args.postData;}else{if("putData" in args){_291.query=args.putData;}else{if("rawBody" in args){_291.query=args.rawBody;}else{if((arguments.length>2&&!_290)||"POST|PUT".indexOf(_28f.toUpperCase())==-1){_25c._ioAddQueryToUrl(_291);}}}}xhr.open(_28f,_291.url,args.sync!==true,args.user||undefined,args.password||undefined);if(args.headers){for(var hdr in args.headers){if(hdr.toLowerCase()==="content-type"&&!args.contentType){args.contentType=args.headers[hdr];}else{if(args.headers[hdr]){xhr.setRequestHeader(hdr,args.headers[hdr]);}}}}xhr.setRequestHeader("Content-Type",args.contentType||_28a);if(!args.headers||!("X-Requested-With" in args.headers)){xhr.setRequestHeader("X-Requested-With","XMLHttpRequest");}_25c._ioNotifyStart(dfd);if(dojo.config.debugAtAllCosts){xhr.send(_291.query);}else{try{xhr.send(_291.query);}catch(e){_291.error=e;dfd.cancel();}}_25c._ioWatch(dfd,_28b,_28c,_28d);xhr=null;return dfd;};dojo.xhrGet=function(args){return _25c.xhr("GET",args);};dojo.rawXhrPost=dojo.xhrPost=function(args){return _25c.xhr("POST",args,true);};dojo.rawXhrPut=dojo.xhrPut=function(args){return _25c.xhr("PUT",args,true);};dojo.xhrDelete=function(args){return _25c.xhr("DELETE",args);};})();}if(!dojo._hasResource["dojo._base.fx"]){dojo._hasResource["dojo._base.fx"]=true;dojo.provide("dojo._base.fx");(function(){var d=dojo;var _292=d._mixin;dojo._Line=function(_293,end){this.start=_293;this.end=end;};dojo._Line.prototype.getValue=function(n){return ((this.end-this.start)*n)+this.start;};dojo.Animation=function(args){_292(this,args);if(d.isArray(this.curve)){this.curve=new d._Line(this.curve[0],this.curve[1]);}};d._Animation=d.Animation;d.extend(dojo.Animation,{duration:350,repeat:0,rate:20,_percent:0,_startRepeatCount:0,_getStep:function(){var _294=this._percent,_295=this.easing;return _295?_295(_294):_294;},_fire:function(evt,args){var a=args||[];if(this[evt]){if(d.config.debugAtAllCosts){this[evt].apply(this,a);}else{try{this[evt].apply(this,a);}catch(e){console.error("exception in animation handler for:",evt);console.error(e);}}}return this;},play:function(_296,_297){var _298=this;if(_298._delayTimer){_298._clearTimer();}if(_297){_298._stopTimer();_298._active=_298._paused=false;_298._percent=0;}else{if(_298._active&&!_298._paused){return _298;}}_298._fire("beforeBegin",[_298.node]);var de=_296||_298.delay,_299=dojo.hitch(_298,"_play",_297);if(de>0){_298._delayTimer=setTimeout(_299,de);return _298;}_299();return _298;},_play:function(_29a){var _29b=this;if(_29b._delayTimer){_29b._clearTimer();}_29b._startTime=new Date().valueOf();if(_29b._paused){_29b._startTime-=_29b.duration*_29b._percent;}_29b._active=true;_29b._paused=false;var _29c=_29b.curve.getValue(_29b._getStep());if(!_29b._percent){if(!_29b._startRepeatCount){_29b._startRepeatCount=_29b.repeat;}_29b._fire("onBegin",[_29c]);}_29b._fire("onPlay",[_29c]);_29b._cycle();return _29b;},pause:function(){var _29d=this;if(_29d._delayTimer){_29d._clearTimer();}_29d._stopTimer();if(!_29d._active){return _29d;}_29d._paused=true;_29d._fire("onPause",[_29d.curve.getValue(_29d._getStep())]);return _29d;},gotoPercent:function(_29e,_29f){var _2a0=this;_2a0._stopTimer();_2a0._active=_2a0._paused=true;_2a0._percent=_29e;if(_29f){_2a0.play();}return _2a0;},stop:function(_2a1){var _2a2=this;if(_2a2._delayTimer){_2a2._clearTimer();}if(!_2a2._timer){return _2a2;}_2a2._stopTimer();if(_2a1){_2a2._percent=1;}_2a2._fire("onStop",[_2a2.curve.getValue(_2a2._getStep())]);_2a2._active=_2a2._paused=false;return _2a2;},status:function(){if(this._active){return this._paused?"paused":"playing";}return "stopped";},_cycle:function(){var _2a3=this;if(_2a3._active){var curr=new Date().valueOf();var step=(curr-_2a3._startTime)/(_2a3.duration);if(step>=1){step=1;}_2a3._percent=step;if(_2a3.easing){step=_2a3.easing(step);}_2a3._fire("onAnimate",[_2a3.curve.getValue(step)]);if(_2a3._percent<1){_2a3._startTimer();}else{_2a3._active=false;if(_2a3.repeat>0){_2a3.repeat--;_2a3.play(null,true);}else{if(_2a3.repeat==-1){_2a3.play(null,true);}else{if(_2a3._startRepeatCount){_2a3.repeat=_2a3._startRepeatCount;_2a3._startRepeatCount=0;}}}_2a3._percent=0;_2a3._fire("onEnd",[_2a3.node]);!_2a3.repeat&&_2a3._stopTimer();}}return _2a3;},_clearTimer:function(){clearTimeout(this._delayTimer);delete this._delayTimer;}});var ctr=0,_2a4=null,_2a5={run:function(){}};d.extend(d.Animation,{_startTimer:function(){if(!this._timer){this._timer=d.connect(_2a5,"run",this,"_cycle");ctr++;}if(!_2a4){_2a4=setInterval(d.hitch(_2a5,"run"),this.rate);}},_stopTimer:function(){if(this._timer){d.disconnect(this._timer);this._timer=null;ctr--;}if(ctr<=0){clearInterval(_2a4);_2a4=null;ctr=0;}}});var _2a6=d.isIE?function(node){var ns=node.style;if(!ns.width.length&&d.style(node,"width")=="auto"){ns.width="auto";}}:function(){};dojo._fade=function(args){args.node=d.byId(args.node);var _2a7=_292({properties:{}},args),_2a8=(_2a7.properties.opacity={});_2a8.start=!("start" in _2a7)?function(){return +d.style(_2a7.node,"opacity")||0;}:_2a7.start;_2a8.end=_2a7.end;var anim=d.animateProperty(_2a7);d.connect(anim,"beforeBegin",d.partial(_2a6,_2a7.node));return anim;};dojo.fadeIn=function(args){return d._fade(_292({end:1},args));};dojo.fadeOut=function(args){return d._fade(_292({end:0},args));};dojo._defaultEasing=function(n){return 0.5+((Math.sin((n+1.5)*Math.PI))/2);};var _2a9=function(_2aa){this._properties=_2aa;for(var p in _2aa){var prop=_2aa[p];if(prop.start instanceof d.Color){prop.tempColor=new d.Color();}}};_2a9.prototype.getValue=function(r){var ret={};for(var p in this._properties){var prop=this._properties[p],_2ab=prop.start;if(_2ab instanceof d.Color){ret[p]=d.blendColors(_2ab,prop.end,r,prop.tempColor).toCss();}else{if(!d.isArray(_2ab)){ret[p]=((prop.end-_2ab)*r)+_2ab+(p!="opacity"?prop.units||"px":0);}}}return ret;};dojo.animateProperty=function(args){var n=args.node=d.byId(args.node);if(!args.easing){args.easing=d._defaultEasing;}var anim=new d.Animation(args);d.connect(anim,"beforeBegin",anim,function(){var pm={};for(var p in this.properties){if(p=="width"||p=="height"){this.node.display="block";}var prop=this.properties[p];if(d.isFunction(prop)){prop=prop(n);}prop=pm[p]=_292({},(d.isObject(prop)?prop:{end:prop}));if(d.isFunction(prop.start)){prop.start=prop.start(n);}if(d.isFunction(prop.end)){prop.end=prop.end(n);}var _2ac=(p.toLowerCase().indexOf("color")>=0);function _2ad(node,p){var v={height:node.offsetHeight,width:node.offsetWidth}[p];if(v!==undefined){return v;}v=d.style(node,p);return (p=="opacity")?+v:(_2ac?v:parseFloat(v));};if(!("end" in prop)){prop.end=_2ad(n,p);}else{if(!("start" in prop)){prop.start=_2ad(n,p);}}if(_2ac){prop.start=new d.Color(prop.start);prop.end=new d.Color(prop.end);}else{prop.start=(p=="opacity")?+prop.start:parseFloat(prop.start);}}this.curve=new _2a9(pm);});d.connect(anim,"onAnimate",d.hitch(d,"style",anim.node));return anim;};dojo.anim=function(node,_2ae,_2af,_2b0,_2b1,_2b2){return d.animateProperty({node:node,duration:_2af||d.Animation.prototype.duration,properties:_2ae,easing:_2b0,onEnd:_2b1}).play(_2b2||0);};})();}if(!dojo._hasResource["dojo._base.browser"]){dojo._hasResource["dojo._base.browser"]=true;dojo.provide("dojo._base.browser");dojo.forEach(dojo.config.require,function(i){dojo["require"](i);});}if(!dojo._hasResource["dojo._base"]){dojo._hasResource["dojo._base"]=true;dojo.provide("dojo._base");}if(dojo.isBrowser&&(document.readyState==="complete"||dojo.config.afterOnLoad)){window.setTimeout(dojo._loadInit,100);}})();
  djConfig = {};
})();
;
window.NfireEvent = function(element, event) {
    if (document.createEventObject) {
        if (njQuery)
            return njQuery(element).trigger(event);
        // dispatch for IE
        var evt = document.createEventObject();
        return element.fireEvent('on' + event, evt);
    } else {
        // dispatch for firefox + others
        var evt = document.createEvent("HTMLEvents");
        evt.initEvent(event, true, true); // event type,bubbling,cancelable
        return !element.dispatchEvent(evt);
    }
};
(function(dojo) {
    dojo.declare("NextendElement", null, {
        constructor: function(args) {

        },
        fireEvent: window.NfireEvent
    });
})(ndojo);(function(dojo) {
    dojo.declare("NextendElementList", NextendElement, {
        constructor: function(args) {
            dojo.mixin(this, args);
            
            this.select = dojo.byId(this.hidden+'_select');
            this.hidden = dojo.byId(this.hidden);
            
            this.select.dojohandle = dojo.connect(this.select, 'change', this, 'onSelect');
            
            this.hidden.select = this.select;
            
            dojo.connect(this.hidden, 'change', this, 'reset');
            this.reset();
        },

        reset: function() {
            if(this.hidden.value != this.value){
                this.value = this.hidden.value;
                var value = this.value.split('||');
                var items = dojo.query('option', this.select);
                for(var i = 0; i < items.length; i++){
                    if(value.indexOf(items[i].value) != -1){
                        items[i].selected = true;
                    }else{
                        items[i].selected = false;
                    }
                }
                this.fireEvent(this.hidden, 'change');
            }
            if(!this.multiple){
                var selected = this.select.options[this.select.selectedIndex].value;
                if(selected != this.hidden.value){
                    this.hidden.value = selected;
                    this.fireEvent(this.hidden, 'change');
                }
            }
        },
        
        onSelect: function(){
            var selected = [];
            var items = dojo.query('option', this.select);
            for(var i = 0; i < items.length; i++){
                if(items[i].selected){
                    selected.push(items[i].value);
                }
            }
            this.hidden.value = selected.join('||');
            this.reset();
        }
    });
})(ndojo);(function(dojo) {
    dojo.declare("NextendElementText", NextendElement, {
        constructor: function(args) {
            dojo.mixin(this, args);
            this.hidden = dojo.byId(this.hidden);

            dojo.connect(this.hidden, 'focus', this, 'focus');
            dojo.connect(this.hidden, 'blur', this, 'blur');
        },

        focus: function() {
            dojo.addClass(this.hidden.parentNode, 'focus');
        },

        blur: function() {
            dojo.removeClass(this.hidden.parentNode, 'focus');
        }
    });
})(ndojo);(function(dojo) {
    dojo.declare("NextendElementOnoff", NextendElement, {
        constructor: function(args) {
            dojo.mixin(this, args);
            this.value = -1;
            this.hidden = dojo.byId(this.hidden);

            dojo.connect(this.hidden, 'change', this, 'reset');

            this.reset();
            dojo.connect(this.hidden.parentNode, 'click', this, 'switchSelected');
        },

        reset: function() {
            if (this.value != this.hidden.value) {
                this.value = this.hidden.value;
                this.setSelected(this.value);
            }
        },

        setSelected: function(x) {
            if (x == 1) {
                dojo.addClass(this.hidden.parentNode, 'nextend-onoff-on');
            } else {
                dojo.removeClass(this.hidden.parentNode, 'nextend-onoff-on');
            }
        },

        switchSelected: function() {
            var val = 0;
            if (this.value == 1) val = 0;
            else val = 1;
            this.hidden.value = val;
            this.fireEvent(this.hidden, 'change');
        }
    });
})(ndojo);(function(dojo) {
    dojo.declare("NextendElementMixed", NextendElement, {
        constructor: function(args) {
            dojo.mixin(this, args);
            this.value = '';
            this.hidden = dojo.byId(this.hidden);
            for (var i = 0; i < this.elements.length; i++) {
                this.elements[i] = dojo.byId(this.elements[i]);
                dojo.connect(this.elements[i], 'change', this, 'change');
            }
            this.reset();
            dojo.connect(this.hidden, 'change', this, 'reset');
            this.hidden.nextendmixed = this;
        },

        reset: function() {
            if (this.value != this.hidden.value) {
                this.value = this.hidden.value;
                var parts = this.value.split(this.separator);
                for (var i = 0; i < this.elements.length; i++) {
                    if (typeof parts[i] != "undefined") {
                        this.elements[i].value = parts[i];
                    }
                }
                for (var i = 0; i < this.elements.length; i++) {
                    this.fireEvent(this.elements[i], 'change');
                }
            }
        },

        change: function() {
            var value = '';
            for (var i = 0; i < this.elements.length; i++) {
                if (i != 0) value += this.separator;
                value += this.elements[i].value;
            }
            this.value = this.hidden.value = value;
            this.fireEvent(this.hidden, 'change');
        }
    });
})(ndojo);(function(dojo) {
    dojo.declare("NextendElementSkin", NextendElement, {
        constructor: function(args) {
            dojo.mixin(this, args);
            
            this.hidden = dojo.byId(this.hidden);
            this.select = this.hidden.select;
            this.origText = this.select.options[0].text;
            dojo.connect(this.hidden, 'change', this, 'loadSkin');
        },
        
        loadSkin: function(){
            if(this.hidden.value != '0' && this.skins[this.hidden.value]){
                var skin = this.skins[this.hidden.value];
                for (var k in skin) {
                    if (skin.hasOwnProperty(k)) {
                        var el = dojo.byId(this.preid+k);
                        if(el){
                            if(el.value.substr(0, 2) == '{"'){ // font
                                var orig = dojo.fromJson(el.value);
                                var font = dojo.fromJson(skin[k]);
                                for (var tab in font) {
                                    if (font.hasOwnProperty(tab)) {
                                        if(typeof font[tab].reset != 'undefined'){
                                            orig[tab] = {};
                                        }
                                        if(typeof orig[tab] == 'undefined') orig[tab] = {};
                                        for (var prop in font[tab]) {
                                            if (font[tab].hasOwnProperty(prop)) {
                                                orig[tab][prop] = font[tab][prop];
                                            }
                                        }
                                    }
                                }
                                el.value = dojo.toJson(orig);
                            }else{
                                el.value = skin[k];
                            }
                            this.fireEvent(el, 'change');
                        }
                    }
                };
                
                
                this.changeText('Done');
                this.select.selectedIndex = 0;
                this.fireEvent(this.select, 'change');
                setTimeout(dojo.hitch(this, 'changeText', this.origText), 3000);
            }
        },
        
        changeText: function(text){
            this.select.options[0].text = text;
        }
    });
})(ndojo);(function(dojo) {
    dojo.declare("NextendElementColor", NextendElement, {
        constructor: function(args) {
            dojo.mixin(this, args);
            this.value = 'ffffff';
            this.hidden = dojo.byId(this.hidden);

            dojo.connect(this.hidden, 'change', this, 'reset');

            this.reset();
            if (this.alpha == 1)
                this.alpha = true;
            else
                this.alpha = false;

            njQuery(this.hidden).spectrum({
                showAlpha: this.alpha,
                preferredFormat: (this.alpha == 1 ? "hex8" : "hex6"),
                showInput: false,
                showButtons: false,
                move: dojo.hitch(this, 'onChange'),
                change: dojo.hitch(this, 'onChange')
            });

        },
        reset: function() {
            if (this.value != this.hidden.value) {
                if (this.hidden.value.charAt(0) == '#')
                    this.hidden.value = this.hidden.value.substring(1);
                if (this.hidden.value != this.value) {
                    this.value = this.hidden.value;
                    njQuery(this.hidden).spectrum("set", this.value);
                }
            }
        },
        onChange: function(color) {
            var c = color.toString((this.alpha == 1 ? "hex8" : "hex6"));
            if (c.charAt(0) == '#')
                this.hidden.value = c.substring(1);
            else
                this.hidden.value = c;
            this.fireEvent(this.hidden, 'change');
        }
    });
})(ndojo);(function(dojo) {
    dojo.declare("NextendElementSubform", NextendElement, {
        constructor: function(args) {
            dojo.mixin(this, args);
            this.hidden = dojo.byId(this.hidden);
            this.form = this.hidden.form.nextendform;
            var name = dojo.attr(this.hidden, 'name').match(/\[(.*?)\]/g);
            
            if(name){
                this.name = name[name.length-1].substr(1,name[name.length-1].length-2);
                this.panel = dojo.byId('nextend-'+this.name+'-panel');
            }else{
                return;
            }
            
            dojo.connect(this.hidden, 'change', this, 'reset');
            this.reset();
        },

        reset: function() {
            if (this.value != this.hidden.value) {
                this.value = this.hidden.value;
                this.loadSubform();
            }
        },
        
        loadSubform: function(){
            if(typeof window.nextendajax == 'undefined') window.nextendajax = 0;
            window.nextendajax++;
            dojo.addClass(this.hidden.parentNode, 'nextend-ajax-active');
            var orig = [];
            if(this.value == this.origvalue){
                orig = dojo.clone(this.form.data);
            }
            var data = {
                orig: orig,
                control_name: this.form.control_name,
                xml: (typeof this.xml === 'undefined' ? this.form.xml : this.xml),
                tab: this.tab,
                name: this.name,
                value: this.hidden.value,
                loadedJSS: this.form.loadedJSS,
                loadedCSS: this.form.loadedCSS
            };
            var d = {};
            d.data = dojo.toJson(data);
            d.get = dojo.toJson(this.URLToArray(location.href));
            if(typeof this.form.extra != 'undefined'){
                dojo.mixin(d, this.form.extra);
            }
            dojo.mixin(d, {
                nextendajax: 1,
                mode: 'subform'
            });
            var xhrArgs = {
                url: this.form.url,
                handleAs: 'json',
                content: d,
                load: dojo.hitch(this, 'load'),
                error: dojo.hitch(this, 'error')
            };
            var deferred = dojo.xhrPost(xhrArgs);
        },
        
        load: function(response){
            this.panel.innerHTML = response.html;
            eval(response.scripts);
            dojo.removeClass(this.hidden.parentNode, 'nextend-ajax-active');
            window.nextendajax--;
            njQuery(window).trigger("resize");
        },
        
        error: function(){
            window.nextendajax--;
            alert('There was an error with the AJAX call. Please refresh the page!');
        },
        URLToArray: function(url) {
            var request = {};
            var pairs = url.substring(url.indexOf('?') + 1).split('&');
            for (var i = 0; i < pairs.length; i++) {
                var pair = pairs[i].split('=');
                request[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
            }
            return request;
        }
    });
})(ndojo);/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/

(function(dojo) {
if(!dojo._hasResource["dojo.window"]){
dojo._hasResource["dojo.window"]=true;
dojo.provide("dojo.window");
dojo.getObject("window",true,dojo);
dojo.window.getBox=function(){
var _1=(dojo.doc.compatMode=="BackCompat")?dojo.body():dojo.doc.documentElement;
var _2=dojo._docScroll();
return {w:_1.clientWidth,h:_1.clientHeight,l:_2.x,t:_2.y};
};
dojo.window.get=function(_3){
if(dojo.isIE&&window!==document.parentWindow){
_3.parentWindow.execScript("document._parentWindow = window;","Javascript");
var _4=_3._parentWindow;
_3._parentWindow=null;
return _4;
}
return _3.parentWindow||_3.defaultView;
};
dojo.window.scrollIntoView=function(_5,_6){
try{
_5=dojo.byId(_5);
var _7=_5.ownerDocument||dojo.doc,_8=_7.body||dojo.body(),_9=_7.documentElement||_8.parentNode,_a=dojo.isIE,_b=dojo.isWebKit;
if((!(dojo.isMoz||_a||_b||dojo.isOpera)||_5==_8||_5==_9)&&(typeof _5.scrollIntoView!="undefined")){
_5.scrollIntoView(false);
return;
}
var _c=_7.compatMode=="BackCompat",_d=(_a>=9&&_5.ownerDocument.parentWindow.frameElement)?((_9.clientHeight>0&&_9.clientWidth>0&&(_8.clientHeight==0||_8.clientWidth==0||_8.clientHeight>_9.clientHeight||_8.clientWidth>_9.clientWidth))?_9:_8):(_c?_8:_9),_e=_b?_8:_d,_f=_d.clientWidth,_10=_d.clientHeight,rtl=!dojo._isBodyLtr(),_11=_6||dojo.position(_5),el=_5.parentNode,_12=function(el){
return ((_a<=6||(_a&&_c))?false:(dojo.style(el,"position").toLowerCase()=="fixed"));
};
if(_12(_5)){
return;
}
while(el){
if(el==_8){
el=_e;
}
var _13=dojo.position(el),_14=_12(el);
if(el==_e){
_13.w=_f;
_13.h=_10;
if(_e==_9&&_a&&rtl){
_13.x+=_e.offsetWidth-_13.w;
}
if(_13.x<0||!_a){
_13.x=0;
}
if(_13.y<0||!_a){
_13.y=0;
}
}else{
var pb=dojo._getPadBorderExtents(el);
_13.w-=pb.w;
_13.h-=pb.h;
_13.x+=pb.l;
_13.y+=pb.t;
var _15=el.clientWidth,_16=_13.w-_15;
if(_15>0&&_16>0){
_13.w=_15;
_13.x+=(rtl&&(_a||el.clientLeft>pb.l))?_16:0;
}
_15=el.clientHeight;
_16=_13.h-_15;
if(_15>0&&_16>0){
_13.h=_15;
}
}
if(_14){
if(_13.y<0){
_13.h+=_13.y;
_13.y=0;
}
if(_13.x<0){
_13.w+=_13.x;
_13.x=0;
}
if(_13.y+_13.h>_10){
_13.h=_10-_13.y;
}
if(_13.x+_13.w>_f){
_13.w=_f-_13.x;
}
}
var l=_11.x-_13.x,t=_11.y-Math.max(_13.y,0),r=l+_11.w-_13.w,bot=t+_11.h-_13.h;
if(r*l>0){
var s=Math[l<0?"max":"min"](l,r);
if(rtl&&((_a==8&&!_c)||_a>=9)){
s=-s;
}
_11.x+=el.scrollLeft;
el.scrollLeft+=s;
_11.x-=el.scrollLeft;
}
if(bot*t>0){
_11.y+=el.scrollTop;
el.scrollTop+=Math[t<0?"max":"min"](t,bot);
_11.y-=el.scrollTop;
}
el=(el!=_e)&&!_14&&el.parentNode;
}
}
catch(error){
console.error("scrollIntoView: "+error);
_5.scrollIntoView(false);
}
};
}
})(ndojo);
(function(dojo) {
    dojo.require('dojo.window');
    dojo.declare("NextendWindow", null, {
        constructor: function(args) {
            dojo.mixin(this, args);
            if(typeof window.nextendwindows == 'undefined'){
                window.nextendwindows = [];
            }
            this.container = dojo.query('.nextend-window-container', this.node)[0];
            this.containerinner = dojo.query('.nextend-window-container-inner', this.node)[0];
            this.showed = false;
            this.onResize();
            dojo.connect(window, 'resize', this, 'onResize');

            dojo.connect(document, 'click', function(e) {
                window.nextendwindow = false;
            });

            dojo.connect(this.save, 'click', this, 'hideOverlay');
            if (this.button) dojo.connect(this.button, 'click', this, 'showOverlay');
        },

        onResize: function() {
            this.vs = dojo.window.getBox();
            if (this.showed) this.showOverlay();
        },

        showOverlay: function() {
            dojo.style(this.node, 'display', 'block');
            dojo.style(this.node, 'visibility', 'visible');
            dojo.addClass(this.node, 'active');
            var vs = this.vs;
            dojo.contentBox(this.node, {
                w: vs.w,
                h: vs.h
            });
            dojo.marginBox(this.container, {
                w: vs.w,
                h: vs.h
            });
            
            var h = dojo.position(this.container).h;
            dojo.marginBox(this.containerinner, {
                h: h-70
            });

            if (this.showed == false) this.onResize();
            this.showed = true;
            window.nextendwindows.push(this);
            setTimeout(dojo.hitch(this, 'fireEvent', window, 'resize'), 500);
        },

        hideOverlay: function(e) {
            if(typeof window.nextendajax != 'undefined' && window.nextendajax > 0){
                dojo.stopEvent(e);
                alert('Please wait while processing AJAX call!');
                return;
            }
            if (e) {
                if (window.nextendwindow) return;
                window.nextendwindow = true;
            }
            this.showed = false;
            window.nextendwindows.pop();
            dojo.removeClass(this.node, 'active');
            var _this = this;
            setTimeout(function(){
                dojo.style(_this.node, 'visibility', 'hidden');
                dojo.style(_this.node, 'height', '1px');
            }, 450);
            this.onHide();
        },

        onHide: function() {

        }
    });
    
    /*
     * Close top window on ESC
     */
    dojo.connect(document, 'keyup', function(e){
        if(e.which == 27 && typeof window.nextendwindows != 'undefined' && window.nextendwindows.length > 0){
            window.nextendwindows[window.nextendwindows.length-1].hideOverlay(e);
        }
    });
})(ndojo);(function(dojo) {
    dojo.declare("NextendForm", null, {
        constructor: function(args) {
            this.form = null;
            this.data = null;
            dojo.mixin(this, args);
            this.container = dojo.byId(this.container);
            this.form = dojo.query('input', this.container)[0].form;
            this.form.nextendform = this;
            // Special fix for Joomla 1.6, 1.7 & 2.5. Speedy save!
            if(typeof document.formvalidator != "undefined"){
                document.formvalidator.isValid = function() {return true;};
            }
        }
    });
})(ndojo);var tmpModernizr = null;
if(typeof window.Modernizr !== "undefined" ) tmpModernizr = window.Modernizr;

;window.Modernizr=function(a,b,c){function z(a){j.cssText=a}function A(a,b){return z(m.join(a+";")+(b||""))}function B(a,b){return typeof a===b}function C(a,b){return!!~(""+a).indexOf(b)}function D(a,b){for(var d in a){var e=a[d];if(!C(e,"-")&&j[e]!==c)return b=="pfx"?e:!0}return!1}function E(a,b,d){for(var e in a){var f=b[a[e]];if(f!==c)return d===!1?a[e]:B(f,"function")?f.bind(d||b):f}return!1}function F(a,b,c){var d=a.charAt(0).toUpperCase()+a.slice(1),e=(a+" "+o.join(d+" ")+d).split(" ");return B(b,"string")||B(b,"undefined")?D(e,b):(e=(a+" "+p.join(d+" ")+d).split(" "),E(e,b,c))}var d="2.6.2",e={},f=!0,g=b.documentElement,h="modernizr",i=b.createElement(h),j=i.style,k,l={}.toString,m=" -webkit- -moz- -o- -ms- ".split(" "),n="Webkit Moz O ms",o=n.split(" "),p=n.toLowerCase().split(" "),q={},r={},s={},t=[],u=t.slice,v,w=function(a,c,d,e){var f,i,j,k,l=b.createElement("div"),m=b.body,n=m||b.createElement("body");if(parseInt(d,10))while(d--)j=b.createElement("div"),j.id=e?e[d]:h+(d+1),l.appendChild(j);return f=["&#173;",'<style id="s',h,'">',a,"</style>"].join(""),l.id=h,(m?l:n).innerHTML+=f,n.appendChild(l),m||(n.style.background="",n.style.overflow="hidden",k=g.style.overflow,g.style.overflow="hidden",g.appendChild(n)),i=c(l,a),m?l.parentNode.removeChild(l):(n.parentNode.removeChild(n),g.style.overflow=k),!!i},x={}.hasOwnProperty,y;!B(x,"undefined")&&!B(x.call,"undefined")?y=function(a,b){return x.call(a,b)}:y=function(a,b){return b in a&&B(a.constructor.prototype[b],"undefined")},Function.prototype.bind||(Function.prototype.bind=function(b){var c=this;if(typeof c!="function")throw new TypeError;var d=u.call(arguments,1),e=function(){if(this instanceof e){var a=function(){};a.prototype=c.prototype;var f=new a,g=c.apply(f,d.concat(u.call(arguments)));return Object(g)===g?g:f}return c.apply(b,d.concat(u.call(arguments)))};return e}),q.backgroundsize=function(){return F("backgroundSize")},q.cssanimations=function(){return F("animationName")},q.csstransforms=function(){return!!F("transform")},q.csstransforms3d=function(){var a=!!F("perspective");return a&&"webkitPerspective"in g.style&&w("@media (transform-3d),(-webkit-transform-3d){#modernizr{left:9px;position:absolute;height:3px;}}",function(b,c){a=b.offsetLeft===9&&b.offsetHeight===3}),a},q.csstransitions=function(){return F("transition")};for(var G in q)y(q,G)&&(v=G.toLowerCase(),e[v]=q[G](),t.push((e[v]?"":"no-")+v));return e.addTest=function(a,b){if(typeof a=="object")for(var d in a)y(a,d)&&e.addTest(d,a[d]);else{a=a.toLowerCase();if(e[a]!==c)return e;b=typeof b=="function"?b():b,typeof f!="undefined"&&f&&(g.className+=" nextend-"+(b?"":"no-")+a),e[a]=b}return e},z(""),i=k=null,e._version=d,e._prefixes=m,e._domPrefixes=p,e._cssomPrefixes=o,e.testProp=function(a){return D([a])},e.testAllProps=F,e.testStyles=w,e.prefixed=function(a,b,c){return b?F(a,b,c):F(a,"pfx")},g.className=g.className.replace(/(^|\s)no-js(\s|$)/,"$1$2")+(f?" nextend-js nextend-"+t.join(" nextend-"):""),e}(this,this.document),function(a,b,c){function d(a){return"[object Function]"==o.call(a)}function e(a){return"string"==typeof a}function f(){}function g(a){return!a||"loaded"==a||"complete"==a||"uninitialized"==a}function h(){var a=p.shift();q=1,a?a.t?m(function(){("c"==a.t?B.injectCss:B.injectJs)(a.s,0,a.a,a.x,a.e,1)},0):(a(),h()):q=0}function i(a,c,d,e,f,i,j){function k(b){if(!o&&g(l.readyState)&&(u.r=o=1,!q&&h(),l.onload=l.onreadystatechange=null,b)){"img"!=a&&m(function(){t.removeChild(l)},50);for(var d in y[c])y[c].hasOwnProperty(d)&&y[c][d].onload()}}var j=j||B.errorTimeout,l=b.createElement(a),o=0,r=0,u={t:d,s:c,e:f,a:i,x:j};1===y[c]&&(r=1,y[c]=[]),"object"==a?l.data=c:(l.src=c,l.type=a),l.width=l.height="0",l.onerror=l.onload=l.onreadystatechange=function(){k.call(this,r)},p.splice(e,0,u),"img"!=a&&(r||2===y[c]?(t.insertBefore(l,s?null:n),m(k,j)):y[c].push(l))}function j(a,b,c,d,f){return q=0,b=b||"j",e(a)?i("c"==b?v:u,a,b,this.i++,c,d,f):(p.splice(this.i++,0,a),1==p.length&&h()),this}function k(){var a=B;return a.loader={load:j,i:0},a}var l=b.documentElement,m=a.setTimeout,n=b.getElementsByTagName("script")[0],o={}.toString,p=[],q=0,r="MozAppearance"in l.style,s=r&&!!b.createRange().compareNode,t=s?l:n.parentNode,l=a.opera&&"[object Opera]"==o.call(a.opera),l=!!b.attachEvent&&!l,u=r?"object":l?"script":"img",v=l?"script":u,w=Array.isArray||function(a){return"[object Array]"==o.call(a)},x=[],y={},z={timeout:function(a,b){return b.length&&(a.timeout=b[0]),a}},A,B;B=function(a){function b(a){var a=a.split("!"),b=x.length,c=a.pop(),d=a.length,c={url:c,origUrl:c,prefixes:a},e,f,g;for(f=0;f<d;f++)g=a[f].split("="),(e=z[g.shift()])&&(c=e(c,g));for(f=0;f<b;f++)c=x[f](c);return c}function g(a,e,f,g,h){var i=b(a),j=i.autoCallback;i.url.split(".").pop().split("?").shift(),i.bypass||(e&&(e=d(e)?e:e[a]||e[g]||e[a.split("/").pop().split("?")[0]]),i.instead?i.instead(a,e,f,g,h):(y[i.url]?i.noexec=!0:y[i.url]=1,f.load(i.url,i.forceCSS||!i.forceJS&&"css"==i.url.split(".").pop().split("?").shift()?"c":c,i.noexec,i.attrs,i.timeout),(d(e)||d(j))&&f.load(function(){k(),e&&e(i.origUrl,h,g),j&&j(i.origUrl,h,g),y[i.url]=2})))}function h(a,b){function c(a,c){if(a){if(e(a))c||(j=function(){var a=[].slice.call(arguments);k.apply(this,a),l()}),g(a,j,b,0,h);else if(Object(a)===a)for(n in m=function(){var b=0,c;for(c in a)a.hasOwnProperty(c)&&b++;return b}(),a)a.hasOwnProperty(n)&&(!c&&!--m&&(d(j)?j=function(){var a=[].slice.call(arguments);k.apply(this,a),l()}:j[n]=function(a){return function(){var b=[].slice.call(arguments);a&&a.apply(this,b),l()}}(k[n])),g(a[n],j,b,n,h))}else!c&&l()}var h=!!a.test,i=a.load||a.both,j=a.callback||f,k=j,l=a.complete||f,m,n;c(h?a.yep:a.nope,!!i),i&&c(i)}var i,j,l=this.yepnope.loader;if(e(a))g(a,0,l,0);else if(w(a))for(i=0;i<a.length;i++)j=a[i],e(j)?g(j,0,l,0):w(j)?B(j):Object(j)===j&&h(j,l);else Object(a)===a&&h(a,l)},B.addPrefix=function(a,b){z[a]=b},B.addFilter=function(a){x.push(a)},B.errorTimeout=1e4,null==b.readyState&&b.addEventListener&&(b.readyState="loading",b.addEventListener("DOMContentLoaded",A=function(){b.removeEventListener("DOMContentLoaded",A,0),b.readyState="complete"},0)),a.yepnope=k(),a.yepnope.executeStack=h,a.yepnope.injectJs=function(a,c,d,e,i,j){var k=b.createElement("script"),l,o,e=e||B.errorTimeout;k.src=a;for(o in d)k.setAttribute(o,d[o]);c=j?h:c||f,k.onreadystatechange=k.onload=function(){!l&&g(k.readyState)&&(l=1,c(),k.onload=k.onreadystatechange=null)},m(function(){l||(l=1,c(1))},e),i?k.onload():n.parentNode.insertBefore(k,n)},a.yepnope.injectCss=function(a,c,d,e,g,i){var e=b.createElement("link"),j,c=i?h:c||f;e.href=a,e.rel="stylesheet",e.type="text/css";for(j in d)e.setAttribute(j,d[j]);g||(n.parentNode.insertBefore(e,n),m(c,0))}}(this,document),Modernizr.load=function(){yepnope.apply(window,[].slice.call(arguments,0))};
window.Modernizr.hyphenated = function(str) {
    if(!(str = Modernizr.prefixed(str))) return '';
    return Modernizr.prefixed(str).replace(/([A-Z])/g, function(str, m1) {
        return '-' + m1.toLowerCase();
    }).replace(/^ms-/, '-ms-');
};

window.Modernizr.transitionEnd = (function() {
    var transEndEventNames = {
        'WebkitTransition': 'webkitTransitionEnd',
        'MozTransition': 'transitionend',
        'OTransition': 'oTransitionEnd otransitionend',
        'msTransition': 'MSTransitionEnd',
        'transition': 'transitionend'
    };
    return transEndEventNames[Modernizr.prefixed('transition')];
})();

window.nModernizr = window.Modernizr;

if(tmpModernizr) window.Modernizr = tmpModernizr;

(function($){ $(document).ready(function() {$(".nextend-hastip").qtip({
                position: {
                    my: "bottom center",
                    at: "top right"
                },
                style: {
                    tip: {                        
                        width: 12,
                        height: 6
                    }
                }
            });
            $(".nextend-element-hastip").qtip({
                position: {
                    my: "bottom center",
                    at: "top center"
                },
                style: {
                    tip: {                        
                        width: 12,
                        height: 6
                    }
                }
            });
        

            window.selectText = function(element) {
                var doc = document;

                if (doc.body.createTextRange) { // ms
                    var range = doc.body.createTextRange();
                    range.moveToElementText(element);
                    range.select();
                } else if (window.getSelection) { // moz, opera, webkit
                    var selection = window.getSelection();
                    var range = doc.createRange();
                    range.selectNodeContents(element);
                    selection.removeAllRanges();
                    selection.addRange(range);
                }
            }
            $("#generatorvariables").html("<p class=\"nextend-variables\"><span class=\"nextend-variable nextend-variable-hastip\" title=\"Url to the image for 1. record in group\" onClick=\"selectText(this);\">{|image_url-1|}</span> <span class=\"nextend-variable nextend-variable-hastip\" title=\"Name of the image file for 1. record in group\" onClick=\"selectText(this);\">{|file_name-1|}</span> </p><style>.nextend-variables{line-height: 20px; font-size: 13px;}.nextend-variable{margin: 0 5px;}</style>");
            $("#generatorvariables .nextend-variables > span").qtip({
                position: {
                    my: "bottom center",
                    at: "top center"
                }
            });
        

            njQuery(document).ready(function(){
                var el = $('#smartslider-adjust-height');
                el.height(el[0].scrollHeight+10);
                $(window).trigger('resize');
            });
            ndojo.addOnLoad(function(){
                SmartSliderAdminSlide('nextend-smart-slider-0','0','slideslide', 'admin.php?page=nextend-smart-slider2&controller=layouts&action=create');
            });
        

                njQuery(window).on('beforeunload', function() {
                    if (njQuery.now()-window.nextendtime > 60000 && !window.nextendsave) { // 1 min
                        return 'Your slide settings has not been submitted yet.';
                    } else {
                        return;
                    }
                });
            
}); })(njQuery);
(function(dojo){ dojo.addOnLoad(function(){
    new NextendForm({
      container: "smartslider-form",
      data: {},
      xml: "/plugins/smart-slider-2/library/smartslider/admin/models/forms/generator.xml",
      control_name: "generator",
      url: "http://webforum.grifare.com/wp-admin/admin-ajax.php?action=nextend",
      loadedJSS: {"\/home\/grifare\/public_html\/webforum\/wp-content\/plugins\/smart-slider-2\/nextend\/assets\/js\/datetimepicker_css.js":"\/home\/grifare\/public_html\/webforum\/wp-content\/plugins\/smart-slider-2\/nextend\/assets\/js\/datetimepicker_css.js","\/home\/grifare\/public_html\/webforum\/wp-content\/plugins\/smart-slider-2\/nextend\/assets\/js\/class.js":"\/home\/grifare\/public_html\/webforum\/wp-content\/plugins\/smart-slider-2\/nextend\/assets\/js\/class.js","0":"\/home\/grifare\/public_html\/webforum\/wp-content\/plugins\/smart-slider-2\/nextend\/javascript\/jquery\/1.9.1\/njQuery.js","1":"\/home\/grifare\/public_html\/webforum\/wp-content\/plugins\/smart-slider-2\/nextend\/javascript\/jquery\/1.9.1\/uacss.js","2":"\/home\/grifare\/public_html\/webforum\/wp-content\/plugins\/smart-slider-2\/nextend\/javascript\/jquery\/1.9.1\/jquery.unique-element-id.js","3":"\/home\/grifare\/public_html\/webforum\/wp-content\/plugins\/smart-slider-2\/nextend\/assets\/js\/jquery.qtip.min.js","4":"\/home\/grifare\/public_html\/webforum\/wp-content\/plugins\/smart-slider-2\/library\/smartslider\/assets\/admin\/js\/jquery.joyride.js","5":"\/home\/grifare\/public_html\/webforum\/wp-content\/plugins\/smart-slider-2\/library\/smartslider\/assets\/admin\/js\/adminresizer.js","6":"\/home\/grifare\/public_html\/webforum\/wp-content\/plugins\/smart-slider-2\/library\/smartslider\/assets\/admin\/js\/slideordering.js","7":"\/home\/grifare\/public_html\/webforum\/wp-content\/plugins\/smart-slider-2\/library\/smartslider\/assets\/admin\/js\/itemparser.js","8":"\/home\/grifare\/public_html\/webforum\/wp-content\/plugins\/smart-slider-2\/plugins\/nextendslideritem\/button\/button\/parser.js","9":"\/home\/grifare\/public_html\/webforum\/wp-content\/plugins\/smart-slider-2\/plugins\/nextendslideritem\/caption\/caption\/parser.js","10":"\/home\/grifare\/public_html\/webforum\/wp-content\/plugins\/smart-slider-2\/nextend\/assets\/js\/spectrum.js","11":"\/home\/grifare\/public_html\/webforum\/wp-content\/plugins\/smart-slider-2\/plugins\/nextendslideritem\/fade\/fade\/parser.js","12":"\/home\/grifare\/public_html\/webforum\/wp-content\/plugins\/smart-slider-2\/plugins\/nextendslideritem\/flipper\/flipper\/parser.js","13":"\/home\/grifare\/public_html\/webforum\/wp-content\/plugins\/smart-slider-2\/plugins\/nextendslideritem\/heading\/heading\/parser.js","14":"\/home\/grifare\/public_html\/webforum\/wp-content\/plugins\/smart-slider-2\/plugins\/nextendslideritem\/html\/html\/parser.js","15":"\/home\/grifare\/public_html\/webforum\/wp-content\/plugins\/smart-slider-2\/plugins\/nextendslideritem\/iframe\/iframe\/parser.js","16":"\/home\/grifare\/public_html\/webforum\/wp-content\/plugins\/smart-slider-2\/plugins\/nextendslideritem\/image\/image\/parser.js","17":"\/home\/grifare\/public_html\/webforum\/wp-content\/plugins\/smart-slider-2\/plugins\/nextendslideritem\/paragraph\/paragraph\/parser.js","18":"\/home\/grifare\/public_html\/webforum\/wp-content\/plugins\/smart-slider-2\/plugins\/nextendslideritem\/shape\/shape\/parser.js","19":"\/home\/grifare\/public_html\/webforum\/wp-content\/plugins\/smart-slider-2\/plugins\/nextendslideritem\/special\/special\/parser.js","20":"\/home\/grifare\/public_html\/webforum\/wp-content\/plugins\/smart-slider-2\/plugins\/nextendslideritem\/tag\/tag\/parser.js","21":"\/home\/grifare\/public_html\/webforum\/wp-content\/plugins\/smart-slider-2\/plugins\/nextendslideritem\/vimeo\/vimeo\/parser.js","22":"\/home\/grifare\/public_html\/webforum\/wp-content\/plugins\/smart-slider-2\/plugins\/nextendslideritem\/youtube\/youtube\/parser.js","23":"\/home\/grifare\/public_html\/webforum\/wp-content\/plugins\/smart-slider-2\/nextend\/javascript\/jquery\/1.9.1\/jquery.waitforimages.js","24":"\/home\/grifare\/public_html\/webforum\/wp-content\/plugins\/smart-slider-2\/nextend\/javascript\/jquery\/1.9.1\/easing.js","25":"\/home\/grifare\/public_html\/webforum\/wp-content\/plugins\/smart-slider-2\/nextend\/javascript\/jquery\/1.9.1\/jquery.transit.js","26":"\/home\/grifare\/public_html\/webforum\/wp-content\/plugins\/smart-slider-2\/library\/smartslider\/assets\/js\/animationbase.js","27":"\/home\/grifare\/public_html\/webforum\/wp-content\/plugins\/smart-slider-2\/library\/smartslider\/assets\/js\/smartsliderbase.js","28":"\/home\/grifare\/public_html\/webforum\/wp-content\/plugins\/smart-slider-2\/library\/smartslider\/assets\/js\/mainslider.js","29":"\/home\/grifare\/public_html\/webforum\/wp-content\/plugins\/smart-slider-2\/library\/smartslider\/assets\/js\/layers.js","30":"\/home\/grifare\/public_html\/webforum\/wp-content\/plugins\/smart-slider-2\/library\/smartslider\/assets\/js\/motions\/no.js","31":"\/home\/grifare\/public_html\/webforum\/wp-content\/plugins\/smart-slider-2\/library\/smartslider\/assets\/js\/motions\/fade.js","32":"\/home\/grifare\/public_html\/webforum\/wp-content\/plugins\/smart-slider-2\/library\/smartslider\/assets\/js\/motions\/slide.js","33":"\/home\/grifare\/public_html\/webforum\/wp-content\/plugins\/smart-slider-2\/library\/smartslider\/assets\/js\/motions\/transit.js","34":"\/home\/grifare\/public_html\/webforum\/wp-content\/plugins\/smart-slider-2\/plugins\/nextendslidertype\/simple\/simple\/slider.js","35":"\/home\/grifare\/public_html\/webforum\/wp-content\/plugins\/smart-slider-2\/nextend\/assets\/js\/base64.js","36":"\/home\/grifare\/public_html\/webforum\/wp-content\/plugins\/smart-slider-2\/nextend\/assets\/js\/sortable.js","37":"\/home\/grifare\/public_html\/webforum\/wp-content\/plugins\/smart-slider-2\/library\/smartslider\/assets\/admin\/js\/console.js","38":"\/home\/grifare\/public_html\/webforum\/wp-content\/plugins\/smart-slider-2\/library\/smartslider\/assets\/admin\/js\/slide.js","39":"\/home\/grifare\/public_html\/webforum\/wp-content\/plugins\/smart-slider-2\/library\/smartslider\/assets\/admin\/js\/slide.layer.js","40":"\/home\/grifare\/public_html\/webforum\/wp-content\/plugins\/smart-slider-2\/library\/smartslider\/assets\/admin\/js\/slide.item.js","41":"\/home\/grifare\/public_html\/webforum\/wp-content\/plugins\/smart-slider-2\/library\/smartslider\/assets\/admin\/js\/slide.layout.js","42":"\/home\/grifare\/public_html\/webforum\/wp-content\/plugins\/smart-slider-2\/nextend\/javascript\/dojo\/1.6.1\/dojo\/dojo.js","43":"\/home\/grifare\/public_html\/webforum\/wp-content\/plugins\/smart-slider-2\/nextend\/assets\/js\/element.js","44":"\/home\/grifare\/public_html\/webforum\/wp-content\/plugins\/smart-slider-2\/nextend\/assets\/js\/element\/list.js","45":"\/home\/grifare\/public_html\/webforum\/wp-content\/plugins\/smart-slider-2\/nextend\/assets\/js\/element\/text.js","46":"\/home\/grifare\/public_html\/webforum\/wp-content\/plugins\/smart-slider-2\/nextend\/assets\/js\/element\/onoff.js","47":"\/home\/grifare\/public_html\/webforum\/wp-content\/plugins\/smart-slider-2\/nextend\/assets\/js\/element\/mixed.js","48":"\/home\/grifare\/public_html\/webforum\/wp-content\/plugins\/smart-slider-2\/nextend\/assets\/js\/element\/skin.js","49":"\/home\/grifare\/public_html\/webforum\/wp-content\/plugins\/smart-slider-2\/nextend\/assets\/js\/element\/color.js","50":"\/home\/grifare\/public_html\/webforum\/wp-content\/plugins\/smart-slider-2\/nextend\/assets\/js\/element\/subform.js","51":"\/home\/grifare\/public_html\/webforum\/wp-content\/plugins\/smart-slider-2\/nextend\/javascript\/dojo\/1.6.1\/dojo\/window.js","52":"\/home\/grifare\/public_html\/webforum\/wp-content\/plugins\/smart-slider-2\/nextend\/assets\/js\/window.js","53":"\/home\/grifare\/public_html\/webforum\/wp-content\/plugins\/smart-slider-2\/nextend\/assets\/js\/form.js","54":"\/home\/grifare\/public_html\/webforum\/wp-content\/plugins\/smart-slider-2\/nextend\/javascript\/modernizr\/modernizr.js"},
      loadedCSS: {"\/home\/grifare\/public_html\/webforum\/wp-content\/plugins\/smart-slider-2\/nextend\/assets\/css\/ni.css":"\/home\/grifare\/public_html\/webforum\/wp-content\/plugins\/smart-slider-2\/nextend\/assets\/css\/ni.css","\/home\/grifare\/public_html\/webforum\/wp-content\/plugins\/smart-slider-2\/library\/smartslider\/assets\/admin\/css\/common.css":"\/home\/grifare\/public_html\/webforum\/wp-content\/plugins\/smart-slider-2\/library\/smartslider\/assets\/admin\/css\/common.css","\/home\/grifare\/public_html\/webforum\/wp-content\/plugins\/smart-slider-2\/library\/smartslider\/assets\/admin\/css\/icons.css":"\/home\/grifare\/public_html\/webforum\/wp-content\/plugins\/smart-slider-2\/library\/smartslider\/assets\/admin\/css\/icons.css","\/home\/grifare\/public_html\/webforum\/wp-content\/plugins\/smart-slider-2\/library\/smartslider\/assets\/admin\/css\/header.css":"\/home\/grifare\/public_html\/webforum\/wp-content\/plugins\/smart-slider-2\/library\/smartslider\/assets\/admin\/css\/header.css","\/home\/grifare\/public_html\/webforum\/wp-content\/plugins\/smart-slider-2\/library\/smartslider\/assets\/admin\/css\/toolbar.css":"\/home\/grifare\/public_html\/webforum\/wp-content\/plugins\/smart-slider-2\/library\/smartslider\/assets\/admin\/css\/toolbar.css","\/home\/grifare\/public_html\/webforum\/wp-content\/plugins\/smart-slider-2\/nextend\/assets\/css\/jquery.qtip.min.css":"\/home\/grifare\/public_html\/webforum\/wp-content\/plugins\/smart-slider-2\/nextend\/assets\/css\/jquery.qtip.min.css","\/home\/grifare\/public_html\/webforum\/wp-content\/plugins\/smart-slider-2\/library\/smartslider\/assets\/admin\/css\/joyride.css":"\/home\/grifare\/public_html\/webforum\/wp-content\/plugins\/smart-slider-2\/library\/smartslider\/assets\/admin\/css\/joyride.css","\/home\/grifare\/public_html\/webforum\/wp-content\/plugins\/smart-slider-2\/library\/smartslider\/assets\/admin\/css\/firstcol.css":"\/home\/grifare\/public_html\/webforum\/wp-content\/plugins\/smart-slider-2\/library\/smartslider\/assets\/admin\/css\/firstcol.css","\/home\/grifare\/public_html\/webforum\/wp-content\/plugins\/smart-slider-2\/library\/smartslider\/assets\/admin\/css\/firstcolslidetoolbox.css":"\/home\/grifare\/public_html\/webforum\/wp-content\/plugins\/smart-slider-2\/library\/smartslider\/assets\/admin\/css\/firstcolslidetoolbox.css","\/home\/grifare\/public_html\/webforum\/wp-content\/plugins\/smart-slider-2\/nextend\/assets\/css\/common.css":"\/home\/grifare\/public_html\/webforum\/wp-content\/plugins\/smart-slider-2\/nextend\/assets\/css\/common.css","\/home\/grifare\/public_html\/webforum\/wp-content\/plugins\/smart-slider-2\/nextend\/assets\/css\/window.css":"\/home\/grifare\/public_html\/webforum\/wp-content\/plugins\/smart-slider-2\/nextend\/assets\/css\/window.css","\/home\/grifare\/public_html\/webforum\/wp-content\/plugins\/smart-slider-2\/nextend\/assets\/css\/configurator.css":"\/home\/grifare\/public_html\/webforum\/wp-content\/plugins\/smart-slider-2\/nextend\/assets\/css\/configurator.css","\/home\/grifare\/public_html\/webforum\/wp-content\/plugins\/smart-slider-2\/nextend\/assets\/css\/form.css":"\/home\/grifare\/public_html\/webforum\/wp-content\/plugins\/smart-slider-2\/nextend\/assets\/css\/form.css","\/home\/grifare\/public_html\/webforum\/wp-content\/plugins\/smart-slider-2\/nextend\/assets\/css\/tabs\/tabbed.css":"\/home\/grifare\/public_html\/webforum\/wp-content\/plugins\/smart-slider-2\/nextend\/assets\/css\/tabs\/tabbed.css","\/home\/grifare\/public_html\/webforum\/wp-content\/plugins\/smart-slider-2\/nextend\/assets\/css\/element\/text.css":"\/home\/grifare\/public_html\/webforum\/wp-content\/plugins\/smart-slider-2\/nextend\/assets\/css\/element\/text.css","\/home\/grifare\/public_html\/webforum\/wp-content\/plugins\/smart-slider-2\/nextend\/assets\/css\/element\/onoff.css":"\/home\/grifare\/public_html\/webforum\/wp-content\/plugins\/smart-slider-2\/nextend\/assets\/css\/element\/onoff.css","\/home\/grifare\/public_html\/webforum\/wp-content\/plugins\/smart-slider-2\/nextend\/assets\/css\/element\/mixed.css":"\/home\/grifare\/public_html\/webforum\/wp-content\/plugins\/smart-slider-2\/nextend\/assets\/css\/element\/mixed.css","\/home\/grifare\/public_html\/webforum\/wp-content\/plugins\/smart-slider-2\/nextend\/assets\/css\/element\/textarea.css":"\/home\/grifare\/public_html\/webforum\/wp-content\/plugins\/smart-slider-2\/nextend\/assets\/css\/element\/textarea.css","\/home\/grifare\/public_html\/webforum\/wp-content\/plugins\/smart-slider-2\/nextend\/assets\/css\/spectrum.css":"\/home\/grifare\/public_html\/webforum\/wp-content\/plugins\/smart-slider-2\/nextend\/assets\/css\/spectrum.css","\/home\/grifare\/public_html\/webforum\/wp-content\/plugins\/smart-slider-2\/nextend\/assets\/css\/element\/color.css":"\/home\/grifare\/public_html\/webforum\/wp-content\/plugins\/smart-slider-2\/nextend\/assets\/css\/element\/color.css","\/home\/grifare\/public_html\/webforum\/wp-content\/plugins\/smart-slider-2\/library\/smartslider\/assets\/admin\/css\/secondcol.css":"\/home\/grifare\/public_html\/webforum\/wp-content\/plugins\/smart-slider-2\/library\/smartslider\/assets\/admin\/css\/secondcol.css","\/home\/grifare\/public_html\/webforum\/wp-content\/plugins\/smart-slider-2\/nextend\/assets\/css\/element\/subform.css":"\/home\/grifare\/public_html\/webforum\/wp-content\/plugins\/smart-slider-2\/nextend\/assets\/css\/element\/subform.css","\/home\/grifare\/public_html\/webforum\/wp-content\/plugins\/smart-slider-2\/nextend\/assets\/css\/calendar.css":"\/home\/grifare\/public_html\/webforum\/wp-content\/plugins\/smart-slider-2\/nextend\/assets\/css\/calendar.css","\/home\/grifare\/public_html\/webforum\/wp-content\/plugins\/smart-slider-2\/nextend\/assets\/css\/jqueryui\/jquery.ui.resizable.css":"\/home\/grifare\/public_html\/webforum\/wp-content\/plugins\/smart-slider-2\/nextend\/assets\/css\/jqueryui\/jquery.ui.resizable.css","\/home\/grifare\/public_html\/webforum\/wp-content\/plugins\/smart-slider-2\/library\/smartslider\/assets\/admin\/css\/layer.css":"\/home\/grifare\/public_html\/webforum\/wp-content\/plugins\/smart-slider-2\/library\/smartslider\/assets\/admin\/css\/layer.css"}
    });


            new NextendElementList({
              hidden: "layerlayer",
              multiple: 0,
              value: "0"
            });
        

            new NextendElementText({
              hidden: "layername"
            });
        

            new NextendElementText({
              hidden: "layerleft"
            });
        

            new NextendElementText({
              hidden: "layertop"
            });
        

            new NextendElementText({
              hidden: "layerwidth"
            });
        

            new NextendElementText({
              hidden: "layerheight"
            });
        

            new NextendElementList({
              hidden: "layeranimationin",
              multiple: 0,
              value: "0"
            });
        

            new NextendElementText({
              hidden: "layerdurationin"
            });
        

            new NextendElementList({
              hidden: "layereasingin",
              multiple: 0,
              value: "linear"
            });
        

            new NextendElementText({
              hidden: "layerdelayin"
            });
        

            new NextendElementText({
              hidden: "layerparallaxin"
            });
        

            new NextendElementOnoff({
              hidden: "layerplayoutafter"
            });
        

            new NextendElementList({
              hidden: "layeranimationout",
              multiple: 0,
              value: "0"
            });
        

            new NextendElementText({
              hidden: "layerdurationout"
            });
        

            new NextendElementList({
              hidden: "layereasingout",
              multiple: 0,
              value: "linear"
            });
        

            new NextendElementText({
              hidden: "layerdelayout"
            });
        

            new NextendElementText({
              hidden: "layerparallaxout"
            });
        

            new NextendElementList({
              hidden: "itemitems",
              multiple: 0,
              value: "0"
            });
        

            new NextendElementText({
              hidden: "item_buttoncontent"
            });
        

            new NextendElementText({
              hidden: "linkitem_buttonlink_0"
            });
        

            new NextendElementList({
              hidden: "linkitem_buttonlink_1",
              multiple: 0,
              value: "_self"
            });
        

            new NextendElementMixed({
              hidden: "item_buttonlink",
              elements: ["linkitem_buttonlink_0","linkitem_buttonlink_1"],
              separator: "|*|"
            });
        

            new NextendElementList({
              hidden: "skinsitem_buttonskins_0",
              multiple: 0,
              value: ""
            });
        

            new NextendElementSkin({
              hidden: "skinsitem_buttonskins_0",
              preid: "item_button",
              skins: {"redsimple":{"buttonclass":"red-simple-button","css":"padding: 5px 10px;\nbox-shadow: 0 1px 1px RGBA(0,0,0,0.2);\nbackground: #e74c3c;\n","csshover":"background: #c0392b;\n              "},"purplesimple":{"buttonclass":"purple-simple-button","css":"padding: 5px 10px;\nbox-shadow: 0 1px 1px RGBA(0,0,0,0.2);\nbackground: #7571a5;\n","csshover":"background: #5c588e;\n              "},"greensimple":{"buttonclass":"green-simple-button","css":"padding: 5px 10px;\nbox-shadow: 0 1px 1px RGBA(0,0,0,0.2);\nbackground: #8ac62c;\n","csshover":"background: #73af33;\n              "},"bluesimple":{"buttonclass":"blue-simple-button","css":"\npadding: 5px 10px;\nbox-shadow: 0 1px 1px RGBA(0,0,0,0.2);\nbackground: #309dff;\n","csshover":"background: #2a89de;\n              "},"whiteopacity":{"buttonclass":"white-opacity-button","css":"padding: 8px 10px;\nbox-shadow: 0 1px 1px RGBA(0,0,0,0.3);\nborder: 2px solid rgba(255, 255, 255, 0.4);\ntext-transform: uppercase;\n-webkit-border-radius: 2px;\n-moz-border-radius: 2px;\nborder-radius: 2px;\nbackground: #ffffff;\nbackground: rgba(255, 255, 255, 0.1);\n-webkit-transition: all 0.2s ease-in-out 0s;\n-moz-transition: all 0.2s ease-in-out 0s;\n-ms-transition: all 0.2s ease-in-out 0s;\n-o-transition: all 0.2s ease-in-out 0s;\ntransition: all 0.2s ease-in-out 0s;\n","csshover":"background: #ffffff;\nbackground: rgba(255, 255, 255, 0.3);\nborder: 2px solid rgba(255, 255, 255, 0.6);\n              "},"blackopacity":{"buttonclass":"black-opacity-button","css":"padding: 8px 10px;\nbox-shadow: 0 1px 1px RGBA(0,0,0,0.3);\nborder: 2px solid rgba(0, 0, 0, 0.4);\ntext-transform: uppercase;\n-webkit-border-radius: 2px;\n-moz-border-radius: 2px;\nborder-radius: 2px;\nbackground: #000000;\nbackground: rgba(0, 0, 0, 0.1);\n-webkit-transition: all 0.2s ease-in-out 0s;\n-moz-transition: all 0.2s ease-in-out 0s;\n-ms-transition: all 0.2s ease-in-out 0s;\n-o-transition: all 0.2s ease-in-out 0s;\ntransition: all 0.2s ease-in-out 0s;\n","csshover":"background: #000000;background: rgba(0, 0, 0, 0.3);\nborder: 2px solid rgba(0, 0, 0, 0.6);\n              "},"purpletransition":{"buttonclass":"purple-transition-button","css":"padding: 8px 10px;\nbox-shadow: 0 1px 1px RGBA(0,0,0,0.2);\ntext-transform: uppercase;\n-webkit-border-radius: 2px;\n-moz-border-radius: 2px;\nborder-radius: 2px;\nbackground: #8e44ad;\n-webkit-transition: background-color 0.4s ease-out 0s;\n-moz-transition: background-color 0.4s ease-out 0s;\n-ms-transition: background-color 0.4s ease-out 0s;\n-o-transition: background-color 0.4s ease-out 0s;\ntransition: background-color 0.4s ease-out 0s;\n","csshover":"background: #9b59b6;\n              "},"greentransition":{"buttonclass":"green-transition-button","css":"padding: 8px 10px;\nbox-shadow: 0 1px 1px RGBA(0,0,0,0.2);\ntext-transform: uppercase;\n-webkit-border-radius: 2px;\n-moz-border-radius: 2px;\nborder-radius: 2px;\nbackground: #80ba26;\n-webkit-transition: background-color 0.4s ease-out 0s;\n-moz-transition: background-color 0.4s ease-out 0s;\n-ms-transition: background-color 0.4s ease-out 0s;\n-o-transition: background-color 0.4s ease-out 0s;\ntransition: background-color 0.4s ease-out 0s;\n","csshover":"background: #6b9c1f;\n              "},"bluetransition":{"buttonclass":"blue-transition-button","css":"padding: 8px 10px;\nbox-shadow: 0 1px 1px RGBA(0,0,0,0.2);\ntext-transform: uppercase;\n-webkit-border-radius: 2px;\n-moz-border-radius: 2px;\nborder-radius: 2px;\nbackground: #2381e2;\n-webkit-transition: background-color 0.4s ease-out 0s;\n-moz-transition: background-color 0.4s ease-out 0s;\n-ms-transition: background-color 0.4s ease-out 0s;\n-o-transition: background-color 0.4s ease-out 0s;\ntransition: background-color 0.4s ease-out 0s;\n","csshover":"background: #1e70c5;\n              "},"purpletransitionrounded":{"buttonclass":"purple-transition-rounded-button","css":"padding: 8px 10px;\nbox-shadow: 0 1px 1px RGBA(0,0,0,0.2);\ntext-transform: uppercase;\n-webkit-border-radius: 2px;\n-moz-border-radius: 2px;\nborder-radius: 2px;\nbackground: #8e44ad;\n-webkit-transition: all 0.4s ease-out 0s;\n-moz-transition: all 0.4s ease-out 0s;\n-ms-transition: all 0.4s ease-out 0s;\n-o-transition: all 0.4s ease-out 0s;\ntransition: all 0.4s ease-out 0s;\n","csshover":"background: #9b59b6;\n-webkit-border-radius: 25px;\n-moz-border-radius: 25px;\nborder-radius: 25px;\n              "},"greentransitionrounded":{"buttonclass":"green-transition-rounded-button","css":"padding: 8px 10px;\nbox-shadow: 0 1px 1px RGBA(0,0,0,0.2);\ntext-transform: uppercase;\n-webkit-border-radius: 2px;\n-moz-border-radius: 2px;\nborder-radius: 2px;\nbackground: #80ba26;\n-webkit-transition: all 0.4s ease-out 0s;\n-moz-transition: all 0.4s ease-out 0s;\n-ms-transition: all 0.4s ease-out 0s;\n-o-transition: all 0.4s ease-out 0s;\ntransition: all 0.4s ease-out 0s;\n","csshover":"background: #6b9c1f;\n-webkit-border-radius: 25px;\n-moz-border-radius: 25px;\nborder-radius: 25px;\n              "},"bluetransitionrounded":{"buttonclass":"blue-transition-rounded-button","css":"padding: 8px 10px;\nbox-shadow: 0 1px 1px RGBA(0,0,0,0.2);\ntext-transform: uppercase;\n-webkit-border-radius: 2px;\n-moz-border-radius: 2px;\nborder-radius: 2px;\nbackground: #2381e2;\n-webkit-transition: all 0.4s ease-out 0s;\n-moz-transition: all 0.4s ease-out 0s;\n-ms-transition: all 0.4s ease-out 0s;\n-o-transition: all 0.4s ease-out 0s;\ntransition: all 0.4s ease-out 0s;\n","csshover":"background: #1e70c5;\n-webkit-border-radius: 25px;\n-moz-border-radius: 25px;\nborder-radius: 25px;\n              "},"greengrad":{"buttonclass":"green-gradient-button","css":"padding: 5px 10px;\nborder: 1px solid #366e02;\nbox-shadow: 0 1px 3px rgba(0, 0, 0, 0.3), 0 1px rgba(255, 255, 255, 0.1) inset, 0 -2px rgba(0, 0, 0, 0.1) inset;\n-webkit-border-radius: 2px;\n-moz-border-radius: 2px;\nborder-radius: 2px;\nbackground: #90c829;\nbackground: -moz-linear-gradient(top,  #90c829 0%, #438b00 100%);\nbackground: -webkit-gradient(linear, left top, left bottom, color-stop(0%,#90c829), color-stop(100%,#438b00));\nbackground: -webkit-linear-gradient(top,  #90c829 0%,#438b00 100%);\nbackground: -o-linear-gradient(top,  #90c829 0%,#438b00 100%);\nbackground: -ms-linear-gradient(top,  #90c829 0%,#438b00 100%);\nbackground: linear-gradient(to bottom,  #90c829 0%,#438b00 100%);\n","csshover":"background: #9dd633;\nbackground: -moz-linear-gradient(top,  #9dd633 0%, #509d09 100%);\nbackground: -webkit-gradient(linear, left top, left bottom, color-stop(0%,#9dd633), color-stop(100%,#509d09));\nbackground: -webkit-linear-gradient(top,  #9dd633 0%,#509d09 100%);\nbackground: -o-linear-gradient(top,  #9dd633 0%,#509d09 100%);\nbackground: -ms-linear-gradient(top,  #9dd633 0%,#509d09 100%);\nbackground: linear-gradient(to bottom,  #9dd633 0%,#509d09 100%);\n              "},"bluegrad":{"buttonclass":"blue-gradient-button","css":"padding: 5px 10px;\nborder: 1px solid #225bc1;\nbox-shadow: 0 1px 3px rgba(0, 0, 0, 0.3), 0 1px rgba(255, 255, 255, 0.1) inset, 0 -2px rgba(0, 0, 0, 0.1) inset;\n-webkit-border-radius: 2px;\n-moz-border-radius: 2px;\nborder-radius: 2px;\nbackground: #339dff;\nbackground: -moz-linear-gradient(top,  #339dff 0%, #1060bf 100%);\nbackground: -webkit-gradient(linear, left top, left bottom, color-stop(0%,#339dff), color-stop(100%,#1060bf));\nbackground: -webkit-linear-gradient(top,  #339dff 0%,#1060bf 100%);\nbackground: -o-linear-gradient(top,  #339dff 0%,#1060bf 100%);\nbackground: -ms-linear-gradient(top,  #339dff 0%,#1060bf 100%);\nbackground: linear-gradient(to bottom,  #339dff 0%,#1060bf 100%);\n","csshover":"background: #4ca7fb;\nbackground: -moz-linear-gradient(top,  #4ca7fb 0%, #116ad3 100%);\nbackground: -webkit-gradient(linear, left top, left bottom, color-stop(0%,#4ca7fb), color-stop(100%,#116ad3));\nbackground: -webkit-linear-gradient(top,  #4ca7fb 0%,#116ad3 100%);\nbackground: -o-linear-gradient(top,  #4ca7fb 0%,#116ad3 100%);\nbackground: -ms-linear-gradient(top,  #4ca7fb 0%,#116ad3 100%);\nbackground: linear-gradient(to bottom,  #4ca7fb 0%,#116ad3 100%);\n              "},"orangegrad":{"buttonclass":"orange-gradient-button","css":"padding: 5px 10px;\nborder: 1px solid #ce570f;\nbox-shadow: 0 1px 3px rgba(0, 0, 0, 0.3), 0 1px rgba(255, 255, 255, 0.1) inset, 0 -2px rgba(0, 0, 0, 0.1) inset;\n-webkit-border-radius: 2px;\n-moz-border-radius: 2px;\nborder-radius: 2px;\nbackground: #f68f46;\nbackground: -moz-linear-gradient(top,  #f68f46 0%, #ee5930 100%);\nbackground: -webkit-gradient(linear, left top, left bottom, color-stop(0%,#f68f46), color-stop(100%,#ee5930));\nbackground: -webkit-linear-gradient(top,  #f68f46 0%,#ee5930 100%);\nbackground: -o-linear-gradient(top,  #f68f46 0%,#ee5930 100%);\nbackground: -ms-linear-gradient(top,  #f68f46 0%,#ee5930 100%);\nbackground: linear-gradient(to bottom,  #f68f46 0%,#ee5930 100%);\n","csshover":"background: #fb9d55;\nbackground: -moz-linear-gradient(top,  #fb9d55 0%, #f85f39 100%);\nbackground: -webkit-gradient(linear, left top, left bottom, color-stop(0%,#fb9d55), color-stop(100%,#f85f39));\nbackground: -webkit-linear-gradient(top,  #fb9d55 0%,#f85f39 100%);\nbackground: -o-linear-gradient(top,  #fb9d55 0%,#f85f39 100%);\nbackground: -ms-linear-gradient(top,  #fb9d55 0%,#f85f39 100%);\nbackground: linear-gradient(to bottom,  #fb9d55 0%,#f85f39 100%);\n              "},"cyanopacity":{"buttonclass":"cyan-opacity-button","css":"padding: 8px 10px;\nbox-shadow: 0 1px 1px RGBA(0,0,0,0.2);\nborder: 2px solid rgba(1, 173, 211, 0.6);\ntext-transform: uppercase;\n-webkit-border-radius: 2px;\n-moz-border-radius: 2px;\nborder-radius: 2px;\nbackground: #01add3;\nbackground: rgba(1, 173, 211, 0.5);\n-webkit-transition: all 0.2s ease-in-out 0s;\n-moz-transition: all 0.2s ease-in-out 0s;\n-ms-transition: all 0.2s ease-in-out 0s;\n-o-transition: all 0.2s ease-in-out 0s;\ntransition: all 0.2s ease-in-out 0s;\n","csshover":"background: #01add3;background: rgba(1, 173, 211, 0.8);\n              "},"cyanopacityinv":{"buttonclass":"cyan-opacity-inv-button","css":"padding: 8px 10px;\nbox-shadow: 0 1px 1px RGBA(0,0,0,0.2);\ntext-transform: uppercase;\n-webkit-border-radius: 2px;\n-moz-border-radius: 2px;\nborder-radius: 2px;              \nborder: 2px solid rgba(1, 173, 211, 0.8);\nbackground: #01add3;\nbackground: rgba(1, 173, 211, 0.8);\n-webkit-transition: all 0.2s ease-in-out 0s;\n-moz-transition: all 0.2s ease-in-out 0s;\n-ms-transition: all 0.2s ease-in-out 0s;\n-o-transition: all 0.2s ease-in-out 0s;\ntransition: all 0.2s ease-in-out 0s;\n","csshover":"background: #01add3;background: rgba(1, 173, 211, 0.5);\nborder: 2px solid rgba(1, 173, 211, 0.6);\n              "},"violetopacity":{"buttonclass":"violet-opacity-button","css":"padding: 8px 10px;\nbox-shadow: 0 1px 1px RGBA(0,0,0,0.2);\nborder: 2px solid rgba(142, 68, 173, 0.6);\ntext-transform: uppercase;\n-webkit-border-radius: 2px;\n-moz-border-radius: 2px;\nborder-radius: 2px;\nbackground: #8e44ad;\nbackground: rgba(142, 68, 173, 0.5);\n-webkit-transition: all 0.2s ease-in-out 0s;\n-moz-transition: all 0.2s ease-in-out 0s;\n-ms-transition: all 0.2s ease-in-out 0s;\n-o-transition: all 0.2s ease-in-out 0s;\ntransition: all 0.2s ease-in-out 0s;\n","csshover":"background: #8e44ad;background: rgba(142, 68, 173, 0.8);\n              "},"violetopacityinv":{"buttonclass":"violet-opacity-inv-button","css":"padding: 8px 10px;\nbox-shadow: 0 1px 1px RGBA(0,0,0,0.2);\ntext-transform: uppercase;\n-webkit-border-radius: 2px;\n-moz-border-radius: 2px;\nborder-radius: 2px;              \nborder: 2px solid rgba(142, 68, 173, 0.8);\nbackground: #8e44ad;\nbackground: rgba(142, 68, 173, 0.8);\n-webkit-transition: all 0.2s ease-in-out 0s;\n-moz-transition: all 0.2s ease-in-out 0s;\n-ms-transition: all 0.2s ease-in-out 0s;\n-o-transition: all 0.2s ease-in-out 0s;\ntransition: all 0.2s ease-in-out 0s;\n","csshover":"background: #8e44ad;background: rgba(142, 68, 173, 0.5);\nborder: 2px solid rgba(142, 68, 173, 0.6);\n              "},"poisonopacity":{"buttonclass":"poison-opacity-button","css":"padding: 8px 10px;\nbox-shadow: 0 1px 1px RGBA(0,0,0,0.2);\nborder: 2px solid rgba(0, 206, 155, 0.6);\ntext-transform: uppercase;\n-webkit-border-radius: 2px;\n-moz-border-radius: 2px;\nborder-radius: 2px;\nbackground: #00ce9b;\nbackground: rgba(0, 206, 155, 0.5);\n-webkit-transition: all 0.2s ease-in-out 0s;\n-moz-transition: all 0.2s ease-in-out 0s;\n-ms-transition: all 0.2s ease-in-out 0s;\n-o-transition: all 0.2s ease-in-out 0s;\ntransition: all 0.2s ease-in-out 0s;\n","csshover":"background: #00ce9b;background: rgba(0, 206, 155, 0.8);\n              "},"poisonopacityinv":{"buttonclass":"poison-opacity-inv-button","css":"padding: 8px 10px;\nbox-shadow: 0 1px 1px RGBA(0,0,0,0.2);\ntext-transform: uppercase;\n-webkit-border-radius: 2px;\n-moz-border-radius: 2px;\nborder-radius: 2px;              \nborder: 2px solid rgba(0, 206, 155, 0.8);\nbackground: #00ce9b;\nbackground: rgba(0, 206, 155, 0.8);\n-webkit-transition: all 0.2s ease-in-out 0s;\n-moz-transition: all 0.2s ease-in-out 0s;\n-ms-transition: all 0.2s ease-in-out 0s;\n-o-transition: all 0.2s ease-in-out 0s;\ntransition: all 0.2s ease-in-out 0s;\n","csshover":"background: #00ce9b;background: rgba(0, 206, 155, 0.5);\nborder: 2px solid rgba(0, 206, 155, 0.6);\n              "}}
            });
        

            new NextendElementMixed({
              hidden: "item_buttonskins",
              elements: ["skinsitem_buttonskins_0"],
              separator: "|*|"
            });
        

            new NextendElementText({
              hidden: "item_buttonbuttonclass"
            });
        

            new NextendElementList({
              hidden: "item_buttonfontclass",
              multiple: 0,
              value: "sliderfont11"
            });
        

            new NextendElementText({
              hidden: "item_buttonclass"
            });
        

            new NextendElementText({
              hidden: "item_captionimage"
            });
        

            new NextendElementText({
              hidden: "item_captionalt"
            });
        

            new NextendElementText({
              hidden: "linkitem_captionlink_0"
            });
        

            new NextendElementList({
              hidden: "linkitem_captionlink_1",
              multiple: 0,
              value: "_self"
            });
        

            new NextendElementMixed({
              hidden: "item_captionlink",
              elements: ["linkitem_captionlink_0","linkitem_captionlink_1"],
              separator: "|*|"
            });
        

            new NextendElementText({
              hidden: "sizeitem_captionsize_0"
            });
        

            new NextendElementText({
              hidden: "sizeitem_captionsize_1"
            });
        

            new NextendElementMixed({
              hidden: "item_captionsize",
              elements: ["sizeitem_captionsize_0","sizeitem_captionsize_1"],
              separator: "|*|"
            });
        

            new NextendElementText({
              hidden: "item_captioncontent"
            });
        

            new NextendElementList({
              hidden: "item_captioncaptionclass",
              multiple: 0,
              value: ""
            });
        

            new NextendElementList({
              hidden: "item_captionfontclasstitle",
              multiple: 0,
              value: "sliderfont1"
            });
        

            new NextendElementList({
              hidden: "item_captionfontclass",
              multiple: 0,
              value: "sliderfont11"
            });
        

            new NextendElementText({
              hidden: "item_captioncolor"
            });
        

            new NextendElementColor({
              hidden: "item_captioncolor",
              alpha: 1
            });
        

            new NextendElementText({
              hidden: "item_captioncustomcaptionclass"
            });
        

            new NextendElementText({
              hidden: "item_captiononmouseenter"
            });
        

            new NextendElementText({
              hidden: "item_captiononmouseclick"
            });
        

            new NextendElementText({
              hidden: "item_captiononmouseleave"
            });
        

            new NextendElementText({
              hidden: "item_fadeimagefront"
            });
        

            new NextendElementText({
              hidden: "item_fadeimageback"
            });
        

            new NextendElementText({
              hidden: "item_fadealt"
            });
        

            new NextendElementText({
              hidden: "linkitem_fadelink_0"
            });
        

            new NextendElementList({
              hidden: "linkitem_fadelink_1",
              multiple: 0,
              value: "_self"
            });
        

            new NextendElementMixed({
              hidden: "item_fadelink",
              elements: ["linkitem_fadelink_0","linkitem_fadelink_1"],
              separator: "|*|"
            });
        

            new NextendElementText({
              hidden: "item_fadewidth"
            });
        

            new NextendElementText({
              hidden: "item_fadefadeclass"
            });
        

            new NextendElementText({
              hidden: "item_fadeclass"
            });
        

            new NextendElementText({
              hidden: "item_fadeonmouseenter"
            });
        

            new NextendElementText({
              hidden: "item_fadeonmouseclick"
            });
        

            new NextendElementText({
              hidden: "item_fadeonmouseleave"
            });
        

            new NextendElementText({
              hidden: "item_flipperimagefront"
            });
        

            new NextendElementText({
              hidden: "item_flipperimageback"
            });
        

            new NextendElementText({
              hidden: "item_flipperalt"
            });
        

            new NextendElementText({
              hidden: "linkitem_flipperlink_0"
            });
        

            new NextendElementList({
              hidden: "linkitem_flipperlink_1",
              multiple: 0,
              value: "_self"
            });
        

            new NextendElementMixed({
              hidden: "item_flipperlink",
              elements: ["linkitem_flipperlink_0","linkitem_flipperlink_1"],
              separator: "|*|"
            });
        

            new NextendElementText({
              hidden: "item_flipperwidth"
            });
        

            new NextendElementText({
              hidden: "item_flipperflipclass"
            });
        

            new NextendElementText({
              hidden: "item_flipperclass"
            });
        

            new NextendElementText({
              hidden: "item_flipperonmouseenter"
            });
        

            new NextendElementText({
              hidden: "item_flipperonmouseclick"
            });
        

            new NextendElementText({
              hidden: "item_flipperonmouseleave"
            });
        

            new NextendElementList({
              hidden: "item_headingpriority",
              multiple: 0,
              value: "1"
            });
        

            new NextendElementText({
              hidden: "linkitem_headinglink_0"
            });
        

            new NextendElementList({
              hidden: "linkitem_headinglink_1",
              multiple: 0,
              value: "_self"
            });
        

            new NextendElementMixed({
              hidden: "item_headinglink",
              elements: ["linkitem_headinglink_0","linkitem_headinglink_1"],
              separator: "|*|"
            });
        

            new NextendElementList({
              hidden: "item_headingfontclass",
              multiple: 0,
              value: "sliderfont1"
            });
        

            new NextendElementText({
              hidden: "item_headingfontsize"
            });
        

            new NextendElementOnoff({
              hidden: "fontcoloritem_headingfontcolor_0"
            });
        

            new NextendElementText({
              hidden: "fontcoloritem_headingfontcolor_1"
            });
        

            new NextendElementColor({
              hidden: "fontcoloritem_headingfontcolor_1",
              alpha: 0
            });
        

            new NextendElementMixed({
              hidden: "item_headingfontcolor",
              elements: ["fontcoloritem_headingfontcolor_0","fontcoloritem_headingfontcolor_1"],
              separator: "|*|"
            });
        

            new NextendElementList({
              hidden: "skinsitem_headingskins_0",
              multiple: 0,
              value: ""
            });
        

            new NextendElementSkin({
              hidden: "skinsitem_headingskins_0",
              preid: "item_heading",
              skins: {"nocaption":{"css":"padding: 0;\nmargin: 0;\nbackground: none;\nbox-shadow: none;\n"},"blackcaption":{"css":"padding: 5px 10px;\nbackground: RGBA(0,0,0,0.4);\nbox-shadow: 0 1px 1px RGBA(255,255,255, 0.2);\n"},"blackcaptiondark":{"css":"padding: 5px 10px;\nbackground: RGBA(0,0,0,0.7);\nbox-shadow: 0 1px 1px RGBA(255,255,255, 0.2);\n"},"whitecaption":{"css":"padding: 5px 10px;\nbackground: RGBA(255,255,255,0.4);\nbox-shadow: 0 1px 1px RGBA(0,0,0, 0.2);\n"},"whitecaptionlight":{"css":"padding: 5px 10px;\nbackground: RGBA(255,255,255,0.7);\nbox-shadow: 0 1px 1px RGBA(0,0,0, 0.2);\n"},"blue":{"css":"padding: 5px 10px;\nbackground: RGBA(1,173,211, 1);\nbox-shadow: 0 1px 1px RGBA(0,0,0, 0.2);\n"},"green":{"css":"padding: 5px 10px;\nbackground: RGBA(115,175,51, 1);\nbox-shadow: 0 1px 1px RGBA(0,0,0, 0.2);\n"},"orange":{"css":"padding: 5px 10px;\nbackground: RGBA(230,126,34, 1);\nbox-shadow: 0 1px 1px RGBA(0,0,0, 0.2);\n"},"red":{"css":"padding: 5px 10px;\nbackground: RGBA(192,57,43, 1);\nbox-shadow: 0 1px 1px RGBA(0,0,0, 0.2);\n"},"levander":{"css":"padding: 5px 10px;\nbackground: RGBA(117,113,165, 1);\nbox-shadow: 0 1px 1px RGBA(0,0,0, 0.2);\n"}}
            });
        

            new NextendElementMixed({
              hidden: "item_headingskins",
              elements: ["skinsitem_headingskins_0"],
              separator: "|*|"
            });
        

            new NextendElementText({
              hidden: "item_headingclass"
            });
        

            new NextendElementText({
              hidden: "item_htmlonmouseenter"
            });
        

            new NextendElementText({
              hidden: "item_htmlonmouseclick"
            });
        

            new NextendElementText({
              hidden: "item_htmlonmouseleave"
            });
        

            new NextendElementText({
              hidden: "item_iframeurl"
            });
        

            new NextendElementText({
              hidden: "sizeitem_iframesize_0"
            });
        

            new NextendElementText({
              hidden: "sizeitem_iframesize_1"
            });
        

            new NextendElementMixed({
              hidden: "item_iframesize",
              elements: ["sizeitem_iframesize_0","sizeitem_iframesize_1"],
              separator: "|*|"
            });
        

            new NextendElementList({
              hidden: "item_iframescroll",
              multiple: 0,
              value: ""
            });
        

            new NextendElementText({
              hidden: "item_iframeonmouseenter"
            });
        

            new NextendElementText({
              hidden: "item_iframeonmouseclick"
            });
        

            new NextendElementText({
              hidden: "item_iframeonmouseleave"
            });
        

            new NextendElementText({
              hidden: "item_imageimage"
            });
        

            new NextendElementText({
              hidden: "item_imagealt"
            });
        

            new NextendElementText({
              hidden: "item_imagetitle"
            });
        

            new NextendElementText({
              hidden: "linkitem_imagelink_0"
            });
        

            new NextendElementList({
              hidden: "linkitem_imagelink_1",
              multiple: 0,
              value: "_self"
            });
        

            new NextendElementMixed({
              hidden: "item_imagelink",
              elements: ["linkitem_imagelink_0","linkitem_imagelink_1"],
              separator: "|*|"
            });
        

            new NextendElementText({
              hidden: "sizeitem_imagesize_0"
            });
        

            new NextendElementText({
              hidden: "sizeitem_imagesize_1"
            });
        

            new NextendElementMixed({
              hidden: "item_imagesize",
              elements: ["sizeitem_imagesize_0","sizeitem_imagesize_1"],
              separator: "|*|"
            });
        

            new NextendElementText({
              hidden: "item_imageonmouseenter"
            });
        

            new NextendElementText({
              hidden: "item_imageonmouseclick"
            });
        

            new NextendElementText({
              hidden: "item_imageonmouseleave"
            });
        

            new NextendElementList({
              hidden: "item_paragraphfontclass",
              multiple: 0,
              value: ""
            });
        

            new NextendElementText({
              hidden: "item_paragraphfontsize"
            });
        

            new NextendElementOnoff({
              hidden: "fontcoloritem_paragraphfontcolor_0"
            });
        

            new NextendElementText({
              hidden: "fontcoloritem_paragraphfontcolor_1"
            });
        

            new NextendElementColor({
              hidden: "fontcoloritem_paragraphfontcolor_1",
              alpha: 0
            });
        

            new NextendElementMixed({
              hidden: "item_paragraphfontcolor",
              elements: ["fontcoloritem_paragraphfontcolor_0","fontcoloritem_paragraphfontcolor_1"],
              separator: "|*|"
            });
        

            new NextendElementText({
              hidden: "item_paragraphclass"
            });
        

            new NextendElementText({
              hidden: "item_paragraphonmouseenter"
            });
        

            new NextendElementText({
              hidden: "item_paragraphonmouseclick"
            });
        

            new NextendElementText({
              hidden: "item_paragraphonmouseleave"
            });
        

            new NextendElementList({
              hidden: "item_shapeshapeclass",
              multiple: 0,
              value: ""
            });
        

            new NextendElementText({
              hidden: "sizeitem_shapesize_0"
            });
        

            new NextendElementText({
              hidden: "sizeitem_shapesize_1"
            });
        

            new NextendElementMixed({
              hidden: "item_shapesize",
              elements: ["sizeitem_shapesize_0","sizeitem_shapesize_1"],
              separator: "|*|"
            });
        

            new NextendElementText({
              hidden: "item_shapecolor"
            });
        

            new NextendElementColor({
              hidden: "item_shapecolor",
              alpha: 1
            });
        

            new NextendElementText({
              hidden: "item_shapeonmouseenter"
            });
        

            new NextendElementText({
              hidden: "item_shapeonmouseclick"
            });
        

            new NextendElementText({
              hidden: "item_shapeonmouseleave"
            });
        

            new NextendElementList({
              hidden: "skinsitem_specialskins_0",
              multiple: 0,
              value: ""
            });
        

            new NextendElementSkin({
              hidden: "skinsitem_specialskins_0",
              preid: "item_special",
              skins: {"pin":{"html":"<div class=\"pin\">\n  <div class=\"circle\"><\/div>      \n  <div class=\"innercircle\"><\/div>\n  <div class=\"aura\"><\/div>  \n<\/div>\n<div style=\"clear: both;\"><\/div>          \n","css":".pin{\nmargin: 20px;\nheight: 20px;\nwidth:20px;\nposition: relative;\nfloat:left;\n}\n\n.circle {\n    background: none repeat scroll 0 0 #9f449b;\n    border-radius: 99px 99px 99px 99px;\n    height: 24px;\n    position: absolute;\n    width: 24px;\n    opacity: .2;\n}\n\n.innercircle {\n    background: #7b3678;\n    border-radius: 99px 99px 99px 99px;\n    margin: 3px;\n    height: 18px;\n    position: absolute;\n    width: 18px;\n    opacity: .5;\n}\n\n.aura {\nborder-radius:99px;\nbackground:#9f449b;\nposition:absolute;\nwidth:24px;\nheight:24px;\nopacity:.4;\n-webkit-animation:glow 1s ease-out infinite;\nanimation:glow 1s ease-out infinite;\n-webkit-transform:scale3d(1,1,1);\n-moz-transform:scale3d(1,1,1);\n-ms-transform:scale3d(1,1,1);\n-o-transform:scale3d(1,1,1);\ntransform:scale3d(1,1,1)\n}\n\n@-webkit-keyframes glow{0%,20%{\n  opacity:.6;-webkit-transform:scale3d(1,1,1);\n  -moz-transform:scale3d(1,1,1);\n  -ms-transform:scale3d(1,1,1);\n  -o-transform:scale3d(1,1,1);\n  transform:scale3d(1,1,1)}\n\n100%{\n  opacity:0;\n  -webkit-transform:scale3d(2,2,1);\n  -moz-transform:scale3d(2,2,1);\n  -ms-transform:scale3d(2,2,1);\n  -o-transform:scale3d(2,2,1);\n  transform:scale3d(2,2,1)}}\n\n@keyframes glow{0%,20%{\n  opacity:.6;\n  -webkit-transform:scale3d(1,1,1);\n  -moz-transform:scale3d(1,1,1);\n  -ms-transform:scale3d(1,1,1);\n  -o-transform:scale3d(1,1,1);\n  transform:scale3d(1,1,1)}\n\n100%{opacity:0;\n  -webkit-transform:scale3d(2,2,1);\n  -moz-transform:scale3d(2,2,1);\n  -ms-transform:scale3d(2,2,1);\n  -o-transform:scale3d(2,2,1);\n  transform:scale3d(2,2,1)\n}\n"},"marquee":{"html":"\n  <div class=\"marquee\">\n      <div>\n          <span>Here comes my first sentence.<\/span>\n      <\/div>\n  <\/div>\n","css":"\n.marquee {\n    height: 30px;    \n    overflow: hidden;\n    position: relative;\n}\n    .marquee div {\n        display: block;\n        width: 200%;\n        height: 30px;\n        \n        position: absolute;\n        overflow: hidden;\n        \n        -webkit-animation: marquee 4s linear infinite;\n        -moz-animation: marquee 4s linear infinite;\n        -ms-animation: marquee 4s linear infinite;\n        -o-animation: marquee 4s linear infinite;\n        animation: marquee 4s linear infinite;\n    }\n    .marquee span {\n        float: left;\n        width: 50%;\n    }\n    \n@-webkit-keyframes marquee {\n    0% { left: 0; }\n    100% { left: -100%; }\n}\n@-moz-keyframes marquee {\n    0% { left: 0; }\n    100% { left: -100%; }\n}\n@-ms-keyframes marquee {\n    0% { left: 0; }\n    100% { left: -100%; }\n}\n@-o-keyframes marquee {\n    0% { left: 0; }\n    100% { left: -100%; }\n}\n@keyframes marquee {\n    0% { left: 0; }\n    100% { left: -100%; }\n}\n"},"rolling":{"html":"<a href=\"#\" target=\"_blank\" class=\"rolling sliderfont5\" style=\"background: none;\">\n<div class=\"container\">\n    <div class=\"front\">Front text<\/div>\n    <div class=\"top\">Hover text<\/div>\n<\/div>\n<\/a>\n            ","css":".rolling {\n  display: block;\n  height: 60px;\n  line-height: 60px !important;\n  text-align: center !important;\n  -webkit-perspective: 500px;\n  perspective: 500px;\n  position: relative;\n  width: 100%;\n  z-index: 1;\n}\n  \n.rolling .container {\n  height: 100%;\n  -webkit-transform-style: preserve-3d;\n  -webkit-transform: translate3d(0px, 0px, -30px);\n  transform: translate3d(0px, 0px, -30px);\n  transform-style: preserve-3d;\n  transition: all 0.2s ease-in-out 0s;\n  width: 100%;\n}\n\n.rolling .container .front {\n    background: #353f48 !important;\n    -webkit-transform: translate3d(0px, 0px, 30px);\n    transform: translate3d(0px, 0px, 30px);\n}\n\n\n.rolling .container .top {\n    background: #7670c7;\n    -webkit-transform: rotateX(90deg) translate3d(0px, 0px, 90px);\n    transform: rotateX(90deg) translate3d(0px, 0px, 90px);\n}\n\n.rolling .container > div {\n    color: white;\n    outline: 1px solid transparent;\n}\n\n.rolling .container:hover {\n    cursor: pointer;\n    -webkit-transform: rotateX(-90deg) translate3d(0px, 25px, 0px);\n    transform: rotateX(-90deg) translate3d(0px, 25px, 0px);\n}\n"}}
            });
        

            new NextendElementMixed({
              hidden: "item_specialskins",
              elements: ["skinsitem_specialskins_0"],
              separator: "|*|"
            });
        

            new NextendElementText({
              hidden: "item_specialonmouseenter"
            });
        

            new NextendElementText({
              hidden: "item_specialonmouseclick"
            });
        

            new NextendElementText({
              hidden: "item_specialonmouseleave"
            });
        

            new NextendElementText({
              hidden: "item_tagcontent"
            });
        

            new NextendElementText({
              hidden: "linkitem_taglink_0"
            });
        

            new NextendElementList({
              hidden: "linkitem_taglink_1",
              multiple: 0,
              value: "_self"
            });
        

            new NextendElementMixed({
              hidden: "item_taglink",
              elements: ["linkitem_taglink_0","linkitem_taglink_1"],
              separator: "|*|"
            });
        

            new NextendElementText({
              hidden: "item_tagcolor2"
            });
        

            new NextendElementColor({
              hidden: "item_tagcolor2",
              alpha: 1
            });
        

            new NextendElementText({
              hidden: "item_taghovercolor2"
            });
        

            new NextendElementColor({
              hidden: "item_taghovercolor2",
              alpha: 1
            });
        

            new NextendElementList({
              hidden: "item_tagfontclass",
              multiple: 0,
              value: "sliderfont7"
            });
        

            new NextendElementText({
              hidden: "item_tagtagclass"
            });
        

            new NextendElementText({
              hidden: "item_tagclass"
            });
        

            new NextendElementText({
              hidden: "item_tagonmouseenter"
            });
        

            new NextendElementText({
              hidden: "item_tagonmouseclick"
            });
        

            new NextendElementText({
              hidden: "item_tagonmouseleave"
            });
        

            new NextendElementText({
              hidden: "item_vimeovimeourl"
            });
        

            new NextendElementOnoff({
              hidden: "item_vimeoautoplay"
            });
        

            new NextendElementOnoff({
              hidden: "item_vimeotitle"
            });
        

            new NextendElementOnoff({
              hidden: "item_vimeobyline"
            });
        

            new NextendElementOnoff({
              hidden: "item_vimeoportrait"
            });
        

            new NextendElementOnoff({
              hidden: "item_vimeoloop"
            });
        

            new NextendElementText({
              hidden: "item_vimeocolor"
            });
        

            new NextendElementColor({
              hidden: "item_vimeocolor",
              alpha: 0
            });
        

            new NextendElementText({
              hidden: "item_youtubeyoutubeurl"
            });
        

            new NextendElementList({
              hidden: "item_youtubedefaultimage",
              multiple: 0,
              value: "maxresdefault"
            });
        

            new NextendElementOnoff({
              hidden: "item_youtubeautoplay"
            });
        

            new NextendElementList({
              hidden: "item_youtubetheme",
              multiple: 0,
              value: "dark"
            });
        

            new NextendElementOnoff({
              hidden: "item_youtuberelated"
            });
        

            new NextendElementList({
              hidden: "item_youtubevq",
              multiple: 0,
              value: "default"
            });
        

            new NextendElementOnoff({
              hidden: "generatorenabled"
            });
        

            new NextendElementList({
              hidden: "generatorsource",
              multiple: 0,
              value: "imagefromfolder_fromfolder"
            });
        

            new NextendElementSubform({
              hidden: "generatorsource",
              origvalue: "imagefromfolder_fromfolder",
              value: "imagefromfolder_fromfolder",
              tab: "generator"
            });
        

            
            var a = new NextendWindow({
              button: dojo.byId("generatorsourcenextend-source-button"),
              node: dojo.byId("generatorsourcenextend-source-lightbox"),
              save: dojo.byId("generatorsourcenextend-source-save")
            });
        

            new NextendElementList({
              hidden: "generatorsourcefolder",
              multiple: 0,
              value: ""
            });
        

            new NextendElementText({
              hidden: "generateslidesgeneratorgenerateslides_0"
            });
        

            new NextendElementOnoff({
              hidden: "generateslidesgeneratorgenerateslides_1"
            });
        

            new NextendElementOnoff({
              hidden: "generateslidesgeneratorgenerateslides_2"
            });
        

            new NextendElementMixed({
              hidden: "generatorgenerateslides",
              elements: ["generateslidesgeneratorgenerateslides_0","generateslidesgeneratorgenerateslides_1","generateslidesgeneratorgenerateslides_2"],
              separator: "|*|"
            });
        

            new NextendElementText({
              hidden: "generatorgeneratorgroup"
            });
        

            new NextendElementText({
              hidden: "slidetitle"
            });
        

            new NextendElementOnoff({
              hidden: "slidepublished"
            });
        

            new NextendElementText({
              hidden: "publishdatesslidepublishdates_0"
            });
        

            new NextendElementText({
              hidden: "publishdatesslidepublishdates_1"
            });
        

            new NextendElementMixed({
              hidden: "slidepublishdates",
              elements: ["publishdatesslidepublishdates_0","publishdatesslidepublishdates_1"],
              separator: "|*|"
            });
        

            new NextendElementText({
              hidden: "slidethumbnail"
            });
        

            new NextendElementText({
              hidden: "backgroundslidebackground_0"
            });
        

            new NextendElementColor({
              hidden: "backgroundslidebackground_0",
              alpha: 1
            });
        

            new NextendElementText({
              hidden: "backgroundslidebackground_1"
            });
        

            new NextendElementMixed({
              hidden: "slidebackground",
              elements: ["backgroundslidebackground_0","backgroundslidebackground_1"],
              separator: "|*|"
            });
        

            new NextendElementText({
              hidden: "slidelink"
            });
        
}); })(ndojo);

