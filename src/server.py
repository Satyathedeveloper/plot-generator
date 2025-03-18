import plotly.graph_objects as go
import plotly.io as pio
from flask import Flask, request, jsonify, Response
from flask_cors import CORS
import pandas as pd

app = Flask(__name__)
CORS(app)

def generate_bar_plot_html(df, x_axis, y_axis, legend):
    fig = go.Figure()

    bar_width = 0.4  # Set the desired bar width

    if legend:
        unique_legends = df[legend].unique()
        for val in unique_legends:
            filtered_df = df[df[legend] == val]
            fig.add_trace(go.Bar(
                x=filtered_df[x_axis],
                y=filtered_df[y_axis],
                name=f'{legend}: {val}',
                width=[bar_width] * len(filtered_df)
            ))
    else:
        fig.add_trace(go.Bar(
            x=df[x_axis],
            y=df[y_axis],
            name=f'{y_axis} vs {x_axis}',
            marker=dict(color='black'),
            width=[bar_width] * len(df)
        ))

    fig.update_layout(
        barmode='group',
        title=f'{y_axis} vs {x_axis}',
        xaxis_title=x_axis,
        plot_bgcolor='white',
        bargap=0.2,  # Set the gap between bars
        bargroupgap=0.1  # Set the gap between groups of bars
    )

    return pio.to_html(fig, full_html=False)

@app.route('/generate-plot', methods=['POST'])
def generate_plot():
    """Generate plots based on selected x-axis, y-axis, legend, and filter."""
    if not request.is_json:
        return jsonify({'error': 'Invalid content type, JSON expected'}), 400

    try:
        req_data = request.get_json()
        data = req_data.get('data', [])
        x_axis = req_data.get('xAxis')
        y_axis = req_data.get('yAxis')
        legend = req_data.get('legend')
        filter_col = req_data.get('filter')
        filter_val = req_data.get('filterValue')

        if not data or not x_axis or not y_axis:
            return jsonify({'error': 'Missing data or axis selection'}), 400

        df = pd.DataFrame(data)

        if filter_col and filter_val:
            df = df[df[filter_col] == filter_val]

        plot_html = generate_bar_plot_html(df, x_axis, y_axis, legend)
        html_response = f'<div>{plot_html}</div>'

        return Response(html_response, content_type='text/html; charset=utf-8')
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
