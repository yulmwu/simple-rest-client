import templateReplacer from './TemplateReplacer'

const HTML = `
<!DOCTYPE html>
<html lang="ko">
    <head>
        <meta charset="UTF-8" />
        <title>JSON to HTML Table with Icons</title>
        <script
            src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/js/all.min.js"
            integrity="sha512-b+nQTCdtTBIRIbraqNEwsjB6UvL3UEMkXnhzd8awtCYh0Kcsjl9uEgwVFVbhoj3uu1DO1ZMacNvLoyJJiNfcvg=="
            crossorigin="anonymous"
            referrerpolicy="no-referrer"
        ></script>
        <style>
            body {
                font-family: monospace;
                background-color: #f9f9f9;
                color: #333;
                padding: 2rem;
                line-height: 1.6;
            }

            h2 {
                margin-bottom: 1rem;
                font-size: 2rem;
            }

            textarea {
                width: 100%;
                height: 180px;
                font-size: 14px;
                padding: 1rem;
                border: 1px solid #ccc;
                border-radius: 8px;
                resize: vertical;
                box-sizing: border-box;
                background: #fff;
            }

            table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 2rem;
                background: white;
                border-radius: 8px;
                overflow: hidden;
                box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
                font-size: 16px;
            }

            th,
            td {
                padding: 10px 12px;
                text-align: left;
                border-bottom: 1px solid #e0e0e0;
            }

            th {
                background-color: #f3f4f6;
            }

            .key-cell {
                white-space: pre-wrap;
            }

            .key-icon {
                margin-right: 10px;
                color: #3b82f6;
                min-width: 16px;
            }

            .error {
                color: #dc2626;
                font-weight: bold;
                margin-top: 1rem;
            }
        </style>
    </head>
<body>
    <div id="output">
        $BODY$
    </div>
</body>
`

class HTMLOutput {
    private body: string = ''
    private json: Record<string, object>

    constructor(json: Record<string, object>) {
        this.json = json
    }

    private addRow(key: string, value: any, depth: number = 0): void {
        const iconClass = this.getIconClass(value)
        const indent = '&nbsp;'.repeat(depth * 4)
        const keyCellContent = `${indent}<i class="${iconClass} key-icon"></i>${key}`

        let valueCellContent = ''
        let childrenRows = ''

        if (typeof value === 'object' && value !== null) {
            if (Array.isArray(value)) {
                valueCellContent = value
                    .map((v) => {
                        return typeof v === 'object'
                            ? `<span class="key-icon ${this.getIconClass(v)}"></span>Object`
                            : `• ${this.escapeHtml(String(v))}`
                    })
                    .join('<br>')
            } else {
                valueCellContent = ''
                for (const [subKey, subValue] of Object.entries(value)) {
                    const prevBody = this.body
                    this.body = '' // 자식 rows만 추출하기 위한 초기화
                    this.addRow(subKey, subValue, depth + 1)
                    childrenRows += this.body
                    this.body = prevBody // 원래 body 복원
                }
            }
        } else {
            valueCellContent = this.escapeHtml(String(value))
        }

        // 부모 먼저 추가
        this.body += `
        <tr>
            <td class="key-cell">${keyCellContent}</td>
            <td>${valueCellContent}</td>
        </tr>
    `

        // 그 후 자식 rows 추가
        this.body += childrenRows
    }

    private generateSection(name: string, v: object) {
        this.body += `
            <h2>${name}</h2>
            <textarea readonly>${JSON.stringify(v, null, 2)}</textarea>
            <table>
                <tr>
                    <th>Key</th>
                    <th>Value</th>
                </tr>
        `

        for (const [key, value] of Object.entries(v)) {
            this.addRow(key, value)
        }

        this.body += `
            </table>
        `
    }

    private getIconClass(value: any): string {
        if (typeof value === 'object') {
            if (Array.isArray(value)) return 'fa-solid fa-list'
            if (value === null) return 'fas fa-circle-notch'
            return 'fas fa-folder'
        }
        if (typeof value === 'string') return 'fas fa-font'
        if (typeof value === 'number') return 'fas fa-hashtag'
        if (typeof value === 'boolean') return 'fas fa-toggle-on'
        return 'fas fa-code'
    }

    private escapeHtml(str: string): string {
        return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    }

    public generate(): string {
        for (const [key, value] of Object.entries(this.json)) {
            console.log(`Generating section for: ${key}`)
            this.generateSection(key, value)
        }
        return templateReplacer(HTML, { BODY: this.body })
    }
}

export default HTMLOutput
