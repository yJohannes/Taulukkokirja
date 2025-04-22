from bs4 import BeautifulSoup


def strip_table(latex: bool=False, display: bool=False):
    with open("data/target.html") as file:
        soup = BeautifulSoup(file, "html.parser")

        s = ""
        s += """<div class ="table-container">\n"""
        s += """<table class="table-striped">\n"""

        head = soup.find("thead")

        if (head):
            s += "<thead>\n"
            for tr in head.find_all("tr"):
                s += "<tr>\n"
                for th in tr.find_all("th"):
                    text = th.get_text(strip=True)
                    rowspan = th.get("rowspan")
                    colspan = th.get("colspan")
                    s += "<th"
                    if rowspan and int(rowspan) > 1:
                        s += f' rowspan="{rowspan}"'
                    if colspan and int(colspan) > 1:
                        s += f' colspan="{colspan}"'
                    
                    s += f">{text}"
                    s += "</th>\n"
                s += "</tr>\n"
            s += "</thead>\n"

        s += "<tbody>\n"
        for tr in soup.find("tbody").find_all("tr"):
            s += "<tr>\n"
            for td in tr.find_all("td"):
                text = td.get_text("\n", strip=True)
                rowspan = td.get("rowspan")
                colspan = td.get("colspan")
                s += "<td"
                if rowspan and int(rowspan) > 1:
                    s += f' rowspan="{rowspan}"'
                if colspan and int(colspan) > 1:
                    s += f' colspan="{colspan}"'

                if latex:
                    s += ">"
                    if display:
                        s += '<span class="latex-container display">'
                    else:
                        s += '<span class="latex-container">'
                    s += text
                    s += "</span></td>"
                else:
                    s += f">{text}</td>\n"

            s += "</tr>\n"
        s += "</tbody>\n"


        s += "</table>\n"
        s += "</div>\n"

        with open("data/output.html", "w") as output:
            output.write(s)

strip_table(True, True)