"""
Manim Scene for MCP Showcase
피타고라스 정리 시각화 애니메이션
"""
from manim import *

class PythagorasTheorem(Scene):
    def construct(self):
        # 제목
        title = Text("피타고라스 정리", font_size=48, color=WHITE)
        title.to_edge(UP)
        self.play(Write(title))
        self.wait(0.5)

        # 직각삼각형 생성
        triangle = Polygon(
            ORIGIN, 3*RIGHT, 3*RIGHT + 4*UP,
            color=BLUE, fill_opacity=0.3
        ).shift(LEFT * 1.5 + DOWN * 1)

        # 변의 라벨
        a_label = MathTex("a=3", color=YELLOW).next_to(triangle, DOWN)
        b_label = MathTex("b=4", color=GREEN).next_to(triangle, RIGHT)
        c_label = MathTex("c=5", color=RED).move_to(
            triangle.get_center() + LEFT * 0.8 + UP * 0.5
        )

        self.play(Create(triangle))
        self.play(Write(a_label), Write(b_label), Write(c_label))
        self.wait(0.5)

        # 직각 표시
        right_angle = RightAngle(
            Line(3*RIGHT + 4*UP, 3*RIGHT).shift(LEFT * 1.5 + DOWN * 1),
            Line(3*RIGHT, ORIGIN).shift(LEFT * 1.5 + DOWN * 1),
            length=0.3,
            color=WHITE
        )
        self.play(Create(right_angle))

        # 공식
        formula = MathTex(
            "a^2", "+", "b^2", "=", "c^2",
            color=WHITE, font_size=56
        ).to_edge(DOWN, buff=1.5)
        formula[0].set_color(YELLOW)
        formula[2].set_color(GREEN)
        formula[4].set_color(RED)

        self.play(Write(formula))
        self.wait(0.5)

        # 숫자 대입
        formula_nums = MathTex(
            "3^2", "+", "4^2", "=", "5^2",
            color=WHITE, font_size=56
        ).next_to(formula, DOWN)

        self.play(TransformFromCopy(formula, formula_nums))
        self.wait(0.3)

        # 계산 결과
        result = MathTex(
            "9", "+", "16", "=", "25",
            color=WHITE, font_size=56
        ).next_to(formula_nums, DOWN)
        result[0].set_color(YELLOW)
        result[2].set_color(GREEN)
        result[4].set_color(RED)

        self.play(TransformFromCopy(formula_nums, result))
        self.wait(0.5)

        # 체크마크
        check = MathTex(r"\checkmark", color=GREEN, font_size=72)
        check.next_to(result, RIGHT, buff=0.5)
        self.play(Write(check))
        self.wait(1)


class CircleArea(Scene):
    def construct(self):
        # 제목
        title = Text("원의 넓이", font_size=48, color=WHITE)
        title.to_edge(UP)
        self.play(Write(title))

        # 원 생성
        circle = Circle(radius=2, color=BLUE, fill_opacity=0.3)
        self.play(Create(circle))

        # 반지름 표시
        radius_line = Line(ORIGIN, 2*RIGHT, color=YELLOW, stroke_width=4)
        radius_label = MathTex("r", color=YELLOW, font_size=36)
        radius_label.next_to(radius_line, DOWN, buff=0.2)

        self.play(Create(radius_line), Write(radius_label))
        self.wait(0.5)

        # 공식 전개
        formula1 = MathTex(r"A = \pi r^2", font_size=56, color=WHITE)
        formula1.to_edge(DOWN, buff=2)
        self.play(Write(formula1))
        self.wait(0.5)

        # 원을 조각으로 나누기 애니메이션
        sectors = VGroup()
        n_sectors = 12
        for i in range(n_sectors):
            sector = Sector(
                outer_radius=2,
                angle=TAU/n_sectors,
                start_angle=i*TAU/n_sectors,
                color=BLUE if i % 2 == 0 else TEAL,
                fill_opacity=0.5,
                stroke_color=WHITE
            )
            sectors.add(sector)

        self.play(
            FadeOut(circle),
            *[Create(s) for s in sectors],
            run_time=1.5
        )
        self.wait(0.5)

        # 직사각형으로 변환
        rect_height = 2  # 반지름
        rect_width = PI * 2  # 원주의 절반

        rect = Rectangle(
            height=rect_height,
            width=rect_width,
            color=BLUE,
            fill_opacity=0.3
        ).shift(DOWN * 0.5)

        self.play(
            FadeOut(sectors),
            FadeIn(rect),
            FadeOut(radius_line),
            FadeOut(radius_label)
        )

        # 직사각형 치수
        width_brace = Brace(rect, DOWN, color=GREEN)
        width_label = MathTex(r"\pi r", color=GREEN).next_to(width_brace, DOWN)

        height_brace = Brace(rect, LEFT, color=YELLOW)
        height_label = MathTex("r", color=YELLOW).next_to(height_brace, LEFT)

        self.play(
            Create(width_brace), Write(width_label),
            Create(height_brace), Write(height_label)
        )
        self.wait(0.5)

        # 최종 공식 강조
        final = MathTex(
            r"A = \pi r \times r = \pi r^2",
            font_size=48, color=WHITE
        ).to_edge(DOWN, buff=0.5)

        self.play(Transform(formula1, final))
        self.wait(1)
