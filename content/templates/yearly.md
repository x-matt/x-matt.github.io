<%* 
	const year = await tp.system.prompt("4 digit year") 
	await tp.file.rename(`${year}-Y`);
%>
<%* 
	tR += "# Annual Review:"
	tR += "\n\n"
	tR += "[[" + (year - 1) +"-Y]]" + " <== <button class='date_button_today'>This Year</button> ==> " + "[[" + (parseInt(year) + 1) + "-Y]]"
	tR += "\n\n"
	tR += "## Aliases"
	tR += "\n\n"
	tR += "```dataview" + "\n"
	tR += "TABLE aliases" + "\n"
	tR += "FROM \"journal\"" + "\n"
	tR += "WHERE aliases != null" + "\n"
	tR += "WHERE length(aliases) > 1" + "\n"
	tR += "WHERE file.day.year = " + `${year}` + "\n"
	tR += "```"
	tR += "\n\n"
	tR += "## Highlights"
	tR += "\n\n"
	tR += "```dataview" + "\n"
	tR += "TABLE WITHOUT ID dateformat(file.ctime, \"yyyy-MM\") AS Month, file.day.weekyear AS Week, highlights" + "\n"
	tR += "FROM \"journal\"" + "\n"
	tR += "WHERE highlights != null" + "\n"
	tR += "WHERE file.day.year = " + `${year}` + "\n"
	tR += "SORT file.day.weekyear" + "\n"
	tR += "```"
	tR += "\n\n"

%>