from bs4 import BeautifulSoup

def strip_table(latex: bool = False, display: bool = False):
    with open("data_manipulation/target.html", 'r', errors="ignore") as file:
        file = file.read().replace('&nbsp;', '')
        soup = BeautifulSoup(file, "html.parser")

        s = ""
        s += """<div class="fit-container">\n"""
        s += """<table class="table-striped">\n"""

        head = soup.find("thead")

        if head:
            s += "<thead>\n"
            for tr in head.find_all("tr"):
                s += "<tr>\n"
                for th in tr.find_all("th"):
                    rowspan = th.get("rowspan")
                    colspan = th.get("colspan")
                    s += "<th"
                    if rowspan and int(rowspan) > 1:
                        s += f' rowspan="{rowspan}"'
                    if colspan and int(colspan) > 1:
                        s += f' colspan="{colspan}"'

                    # Store bolded contents
                    bold_texts = [str(span.get_text(strip=True)) for span in th.find_all("span", class_="inlineTitle", recursive=True)]
                    
                    content = ""
                    for element in th.contents:
                        if latex and element.name == "svg":
                            if element.find("title"):
                                latex_text = element.find("title").get_text(strip=True)
                                if display:
                                    content += f'<span class="latex-container display">{latex_text}</span>'
                                else:
                                    content += f'<span class="latex-container">{latex_text}</span>'
                        else:
                            content += str(element)

                    # Reinsert <b> tags where necessary
                    for bold_text in bold_texts:
                        content = content.replace(bold_text, f'<b>{bold_text}</b>')

                    s += f">{content}</th>\n"

                s += "</tr>\n"
            s += "</thead>\n"

        s += "<tbody>\n"
        for tr in soup.find("tbody").find_all("tr"):
            s += "<tr>\n"
            for td in tr.find_all("td"):
                rowspan = td.get("rowspan")
                colspan = td.get("colspan")
                s += "<td"
                if rowspan and int(rowspan) > 1:
                    s += f' rowspan="{rowspan}"'
                if colspan and int(colspan) > 1:
                    s += f' colspan="{colspan}"'

                content = ""
                for element in td.contents:
                    if latex and element.name == "svg":
                        if element.find("title"):
                            latex_text = element.find("title").get_text(strip=True)
                            if display:
                                content += f'<span class="latex-container display">{latex_text}</span>'
                            else:
                                content += f'<span class="latex-container">{latex_text}</span>'
                    elif element.name == "span":
                        # Check if this span contains a <sup>
                        sup = element.find("sup")
                        if sup:
                            # Get full span text excluding <sup>, then insert <sup> manually
                            span_text = element.get_text("", strip=True)
                            sup_text = sup.get_text(strip=True)
                            # Remove sup_text from span_text (in case it's embedded)
                            span_text_clean = span_text.replace(sup_text, "").strip()
                            content += f'<b>{span_text_clean}</b><sup>{sup_text}</sup>'
                        else:
                            span_contents = element.get_text(strip=True)
                            content += f'<b>{span_contents}</b>'
                    elif element.name == "sup":
                        content += f'<sup>{element.get_text()}</sup>'
                    elif element.name == "em":
                        content += f'<span class="latex-container">{element.get_text()}</span>'
                    elif element.name == "i":
                        content += f'<span class="latex-container">{element.get_text()}</span>'
                    else:

                        content += str(element)

                s += f">{content}</td>\n"

            s += "</tr>\n"
        s += "</tbody>\n"

        s += "</table>\n"
        s += "</div>\n"

        s = s.replace('�', ' ').replace('−', '-').replace('�', '')
        s = s.replace('<br />', '')

        # Prettify and write to file
        with open("data_manipulation/output.html", "w") as output:
            output.write(BeautifulSoup(s, "html.parser").prettify())

strip_table(True, True)